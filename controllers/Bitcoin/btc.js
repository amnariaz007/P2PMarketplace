//This module help to listen request
var express = require('express');
var router = express.Router();
const axios = require('axios');

const crypto = require('crypto');
const EC = require('elliptic').ec;
const RIPEMD160 = require('ripemd160');
const bs58 = require('bs58');
const buffer = require('buffer');
const ec = new EC('secp256k1');
var bitcore = require('bitcore-lib');

var Insight = require('bitcore-explorers').Insight;
var insight = new Insight();



// ---------------------------------Create Account----------------------------------------------
router.get('/create_wallet', function (request, response) {

	var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	try {
		const addrVer = Buffer.alloc(1, 0x00); // 0x00 P2PKH Mainnet, 0x6f P2PKH Testnet
		const wifByte = Buffer.alloc(1, 0x80); // 0x80 Mainnet, 0xEF Testnet

		const key = ec.genKeyPair();
		const privKey = key.getPrivate().toString('hex');
		const pubPoint = key.getPublic();
		const x = pubPoint.getX(); // elliptic x
		const y = pubPoint.getY(); // elliptic y

		// Private Key Hashing
		const bufPrivKey = Buffer.from(privKey, 'hex');
		const wifBufPriv = Buffer.concat([wifByte, bufPrivKey], wifByte.length + bufPrivKey.length);
		const wifHashFirst = hasha256(wifBufPriv);
		const wifHashSecond = hasha256(wifHashFirst);
		const wifHashSig = wifHashSecond.slice(0, 4);
		const wifBuf = Buffer.concat([wifBufPriv, wifHashSig], wifBufPriv.length + wifHashSig.length);
		const wifFinal = bs58.encode(wifBuf);

		// Public Key Hashing
		const publicKey = pubPoint.encode('hex');
		console.log(publicKey)
		const publicKeyInitialHash = hasha256(Buffer.from(publicKey, 'hex'));
		console.log('initial', publicKeyInitialHash)
		const publicKeyRIPEHash = new RIPEMD160().update(Buffer.from(publicKeyInitialHash, 'hex')).digest('hex');
		console.log('rip ', publicKeyRIPEHash)
		const hashBuffer = Buffer.from(publicKeyRIPEHash, 'hex');
		const concatHash = Buffer.concat([addrVer, hashBuffer], addrVer.length + hashBuffer.length);
		console.log('concat', concatHash)
		const hashExtRipe = hasha256(concatHash);
		console.log('hasEx', hashExtRipe)
		const hashExtRipe2 = hasha256(hashExtRipe);
		const hashSig = hashExtRipe2.slice(0, 4);
		const bitcoinBinaryStr = Buffer.concat([concatHash, hashSig], concatHash.length + hashSig.length);

		const bitcoinWifAddress = wifFinal.toString('hex');
		const bitcoinAddress = bs58.encode(Buffer.from(bitcoinBinaryStr));

		// Log our new Bitcoin Address and WIF
		// console.log("WIF Private Key : %s", bitcoinWifAddress.toString('hex'));
		// console.log("Bitcoin Address : %s", bitcoinAddress.toString('hex'));
		var date = new Date();
		var timestamp = date.getTime();
		ResponseData = {
			wallet: {
				private: bitcoinWifAddress.toString('hex'),
				public: bitcoinAddress.toString('hex'),
				currency: "btc",
				balance: 0,
				create_date: date,
				sent: 0,
				received: 0,
				link: `https://www.bitpay.org/account/${bitcoinAddress.toString('hex')}`
			},
			message: "",
			timestamp: timestamp,
			status: 200,
			success: true
		};
		ResponseMessage = "Completed";
		ResponseCode = 200;
	} catch (error) {
		ResponseMessage = `Transaction signing stops with the error ${error}`;
		ResponseCode = 400;
	} finally {
		return response.status(200).json({
			code: ResponseCode,
			data: ResponseData,
			msg: ResponseMessage
		});
	}
});

//-----------------------------Get Transactions of Account----------------------------------------------
router.get('/track/:hash', async function (request, response) {
	var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	try {
		if (request.params) {
			if (!request.params.hash) {
				ResponseMessage = "hash / wallet address is missing \n";
				ResponseCode = 206;
			} else {
				let hash = request.params.hash;
				if (hash.length == 64) {
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open("GET", 'https://insight.bitpay.com/api/tx/' + hash, false); // false for synchronous request
					xmlHttp.send();
					var transactions = JSON.parse(xmlHttp.responseText);
					ResponseData = {
						transaction: {
							hash: transactions.txid,
							currency: "BTC",
							from: transactions.vin[0].addr,
							to: transactions.vout[0].scriptPubKey.addresses[0],
							amount: transactions.vout[0].value,
							fee: transactions.fees,
							block: transactions.blockheight,
							n_confirmation: transactions.confirmations,
							link: `https://blockexplorer.com/tx/${hash}`
						},
						message: "",
						timestamp: transactions.time,
						status: 200,
						success: true
					};
					ResponseMessage = "Completed";
					ResponseCode = 200;
				} else if (hash.length == 34) {
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open("GET", 'https://insight.bitpay.com/api/txs/?address=' + hash, false); // false for synchronous request
					xmlHttp.send();
					var transactions = JSON.parse(xmlHttp.responseText);
					ResponseData = {
						transaction: transactions
					};
					ResponseMessage = "Completed";
					ResponseCode = 200;
				} else {
					ResponseMessage = "Invalid Hash or Wallet Address"
					ResponseCode = 400;
				}
			}
		} else {
			ResponseMessage = "Transaction cannot proceeds as request params is empty";
			ResponseCode = 204;
		}
	} catch (error) {
		ResponseMessage = `Transaction signing stops with the error ${error}`;
		ResponseCode = 400;
	} finally {
		return response.status(200).json({
			code: ResponseCode,
			data: ResponseData,
			msg: ResponseMessage
		});
	}
});

//-----------------------------Send Btc from 1 account to the others----------------------------------------------
router.post('/transfer', async function (request, response) {

	var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;

	try {
		if (request.body) {
			var ValidationCheck = true;
			if (!request.body.from_address) {
				ResponseMessage = "from address is missing \n";
				ValidationCheck = false;
			}
			if (!request.body.to_address) {
				ResponseMessage += "to address is missing \n";
				ValidationCheck = false;
			}
			if (!request.body.from_private_key) {
				ResponseMessage += "private key is missing \n";
				ValidationCheck = false;
			}
			if (!request.body.value) {
				ResponseMessage += "value is missing \n";
				ValidationCheck = false;
			} else if (!request.body.value === parseInt(request.body.value)) {
				ResponseMessage += "value must be a number \n";
				ValidationCheck = false;
			}

			if (ValidationCheck == true) {
				let fromAddress = request.body.from_address;
				let toAddress = request.body.to_address;
				let fromPrivateKey = request.body.from_private_key;
				let value = parseInt(request.body.value);
				if (value < 1000) {
					ResponseMessage = 'Value should be greater than or equals to 1000 because gas fee is 50000';
					ResponseCode = 400;
					return;
				}
				if (toAddress.length < 34 || toAddress.length > 34) {
					ResponseMessage = 'ToAddress : Invalid Wallet Addres';
					ResponseCode = 400;
					return;
				}
				let privateKey;
				try {
					privateKey = bitcore.PrivateKey.fromWIF(fromPrivateKey);
				} catch (error) {
					ResponseMessage = `private key is invalid : ${error}`;
					ResponseCode = 400;
					return;
				}

				let _fromAddress = privateKey.toAddress();
				console.log(_fromAddress)
				var balanceObj = await getwalletbalance(_fromAddress);
				if (balanceObj.response == '') {
					let balance = balanceObj.balance * 100000000;
					let gasfee = 50000;
					if (balance >= (value + gasfee)) {
						var unspentObj = await getwalletnspent(_fromAddress);
						if (unspentObj.response == '') {
							var tx = bitcore.Transaction();
							tx.from(unspentObj.data);
							tx.to(toAddress, value);
							tx.change(_fromAddress);
							tx.fee(5000);
							tx.sign(privateKey);
							tx.serialize();
							var broadcastObj = await walletbroadcast(tx);
							if (broadcastObj.response == '') {
								ResponseMessage = "Transaction successfully completed";
								ResponseCode = 200;
								ResponseData = broadcastObj.data;
							} else {
								ResponseMessage = broadcastObj.response;
								ResponseCode = 400;
								return;
							}
						} else {
							ResponseMessage = unspentObj.response;
							ResponseCode = 400;
							return;
						}
					} else {
						ResponseMessage = `Balance is insufficient after adding the gas fee`
						ResponseCode = 400;
						return;
					}
				} else {
					ResponseMessage = balanceObj.response;
					ResponseCode = 400;
					return;
				}

			} else {
				ResponseCode = 206
			}
		} else {
			ResponseMessage = "Transaction cannot proceeds as request body is empty";
			ResponseCode = 204
		}

	} catch (error) {
		ResponseMessage = `Transaction signing stops with the error ${error}`;
		ResponseCode = 400
	} finally {
		return response.status(200).json({
			code: ResponseCode,
			data: ResponseData,
			msg: ResponseMessage
		});
	}


});

//-----------------------------Get Balance of Account----------------------------------------------
router.get('/getBalance/:walletAddress', async function (request, response) {

	var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	try {
		if (request.params) {
			if (!request.params.walletAddress) {
				ResponseMessage = "wallet address is missing \n";
				ResponseCode = 206;
			} else {
				let walletAddress = request.params.walletAddress;
				if (walletAddress.length < 34 || walletAddress.length > 34) {
					ResponseMessage = 'WalletAddress : Invalid Wallet Addres';
					ResponseCode = 400;
				} else {
					var balanceObj = await getwalletbalance(walletAddress);
					if (balanceObj.response == '') {
						const balance = (balanceObj.balance / 100000000);
						var xmlHttp = new XMLHttpRequest();
						xmlHttp.open("GET", 'https://blockexplorer.com/api/txs/?address=' + walletAddress, false); // false for synchronous request
						xmlHttp.send();
						var transactions = JSON.parse(xmlHttp.responseText);
						var date = new Date();
						var timestamp = date.getTime();
						let sent = 0;
						let received = 0;

						for (let i = 0; i < transactions.txs.length; i++) {
							String(transactions.txs[i].vin[0].addr)
								.toUpperCase()
								.localeCompare(String(walletAddress).toUpperCase()) == 0 ?
								(sent += 1) :
								String(transactions.txs[i].vout[0].scriptPubKey.addresses[0])
								.toUpperCase()
								.localeCompare(String(walletAddress).toUpperCase()) == 0 ?
								(received += 1) :
								"";
						}
						ResponseData = {
							wallet: {
								address: walletAddress,
								currency: 'BTC',
								balance: balance,
								create_date: date,
								sent: sent,
								received: received,
								link: `https://blockexplorer.com/address/${walletAddress}`
							},
							message: "",
							timestamp: timestamp,
							status: 200,
							success: true
						};
						ResponseMessage = "Completed";
						ResponseCode = 200;
					}
				}
			}
		} else {
			ResponseMessage = "Transaction cannot proceeds as request params is empty";
			ResponseCode = 204;
		}
	} catch (error) {
		ResponseMessage = `Transaction signing stops with the error ${error}`;
		ResponseCode = 400;
	} finally {
		return response.status(200).json({
			code: ResponseCode,
			data: ResponseData,
			msg: ResponseMessage
		});
	}
});

// ---------------------------- Custom function ----------------------------------------
function hasha256(data) {
	return crypto.createHash('sha256').update(data).digest();
} // A small function I created as there is a lot of sha256 hashing.

function getwalletbalance(_fromAddress) {
	var balance;
	var response = "";
	return new Promise(function (resolve, reject) {
		insight.address(_fromAddress, function (err, res) {
			if (err) {
				response = `Wallet Address ${walletAddress} not found. Search Stop on error : ${err}`;
			} else {
				response = '';
				balance = res.balance;
			}
			var obj = {
				response: response,
				balance: balance
			};
			resolve(obj);
		});
	});
}

function getwalletnspent(_fromAddress) {
	var data;
	var response = "";
	return new Promise(function (resolve, reject) {
		insight.getUnspentUtxos(_fromAddress, function (error, utxos) {
			if (error) {
				response = `Transaction signing stops with the error ${error}`;
			} else {
				data = utxos;
			}
			var obj = {
				response: response,
				data: data
			};
			resolve(obj)
		});
	});
}

function walletbroadcast(txdata) {
	var data;
	var response = "";
	return new Promise(function (resolve, reject) {
		insight.broadcast(txdata.toString(), function (err, returnedTxId) {
			if (err) {
				response = `Transaction broadcasting failed due to unresolved error ${err}`;
			} else {
				//data = returnedTxId;
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("GET", 'https://insight.bitpay.com/api/tx/' + returnedTxId, false); // false for synchronous request
				xmlHttp.send();
				var transactions = JSON.parse(xmlHttp.responseText);
				data = {
					transaction: {
						hash: transactions.txid,
						currency: "BTC",
						from: transactions.vin[0].addr,
						to: transactions.vout[0].scriptPubKey.addresses[0],
						amount: transactions.vout[0].value,
						fee: transactions.fees,
						block: transactions.blockheight,
						n_confirmation: transactions.confirmations,
						link: `https://blockexplorer.com/tx/${transactions.txid}`
					},
					message: "",
					timestamp: transactions.time,
					status: 200,
					success: true
				};
			}
			var obj = {
				response: response,
				data: data
			};
			resolve(obj)
		});
	});
}

module.exports = router;