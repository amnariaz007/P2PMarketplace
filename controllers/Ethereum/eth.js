//This module help to listen request
var express = require("express");
var router = express.Router();
const axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3();
const Tx = require("ethereumjs-tx");
const Web3EthAccounts = require('web3-eth-accounts');

web3.setProvider(
	new web3.providers.HttpProvider(
		"https://mainnet.infura.io/t2utzUdkSyp5DgSxasQX"
	)
);

// ---------------------------------Create Account----------------------------------------------
router.get("/create_wallet", async function (request, response) {
	var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	try {
		var account = new Web3EthAccounts('https://mainnet.infura.io/t2utzUdkSyp5DgSxasQX');

		let wallet = account.create();
		let walletAddress = wallet.address;
		const balance = await web3.eth.getBalance(walletAddress);
		const weiBalance = web3.fromWei(balance, "ether");
		const count = await web3.eth.getTransactionCount(walletAddress);
		var date = new Date();
		var timestamp = date.getTime();

		ResponseData = {
			wallet: {
				private: wallet.privateKey,
				public: wallet.address,
				currency: "ETH",
				balance: weiBalance,
				create_date: date,
				sent: count,
				received: count,
				link: `https://www.etherscan.io/account/${walletAddress}`
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

//-----------------------------Get Balance of Account----------------------------------------------

router.get("/getBalance/:walletAddress", async function (request, response) {
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

				if (walletAddress.length < 42) {
					ResponseMessage = "Invalid Wallet Address"
					ResponseCode = 400;
					return;
				}
				const balance = await web3.eth.getBalance(walletAddress);
				const weiBalance = web3.fromWei(balance.toNumber(), "ether");
				var date = new Date();
				var timestamp = date.getTime();
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("GET", "http://api.etherscan.io/api?module=account&action=txlist&address=" + walletAddress + "&startblock=0&endblock=99999999&sort=asc", false); // false for synchronous request
				xmlHttp.send();
				var transactions = JSON.parse(xmlHttp.responseText);

				let sent = 0;
				let received = 0;

				for (let i = 0; i < transactions.result.length; i++) {
					String(transactions.result[i].from)
						.toUpperCase()
						.localeCompare(String(walletAddress).toUpperCase()) == 0 ?
						(sent += 1) :
						String(transactions.result[i].to)
						.toUpperCase()
						.localeCompare(String(walletAddress).toUpperCase()) == 0 ?
						(received += 1) :
						"";
				}
				ResponseData = {
					wallet: {
						address: walletAddress,
						currency: "ETH",
						balance: weiBalance,
						create_date: date,
						sent: sent,
						received: received,
						link: `https://www.etherscan.org/account/${walletAddress}`
					},
					message: "",
					timestamp: timestamp,
					status: 200,
					success: true
				};
				ResponseMessage = "Completed";
				ResponseCode = 200;
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

//----------------------------------Send Ethers----------------------------------------------

router.post("/transfer", async function (request, response) {

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
				let privateKey = request.body.from_private_key;
				let toAddress = request.body.to_address;
				let etherValue = request.body.value;


				if (fromAddress.length < 42) {
					ResponseMessage = "Invalid From Address";
					ResponseCode = 400;
					return;
				} else if (toAddress.length < 42) {
					ResponseMessage = "Invalid To Address";
					ResponseCode = 400;
					return;
				}
				etherValue = web3.toWei(etherValue, "ether");
				web3.eth.defaultAccount = fromAddress;

				const sleep = (milliseconds) => {
					return new Promise(resolve => setTimeout(resolve, milliseconds))
				}
				let count = await web3.eth.getTransactionCount(web3.eth.defaultAccount);
				let gasPriceObj = await getgasprice(web3.eth.defaultAccount);

				if (gasPriceObj.response == '') {
					let gasPrice = gasPriceObj.gasprice;
					let gasLimit = 21000;
					privateKey = Buffer.from(privateKey, "hex");
					var rawTransaction = {
						from: fromAddress,
						nonce: web3.toHex(count),
						gasPrice: web3.toHex(gasPrice),
						gasLimit: web3.toHex(gasLimit),
						to: toAddress,
						value: web3.toHex(etherValue),
						chainId: 0x01
						// chainId: 0x5f
					};

					//console.log('2nd')

					let tx = new Tx(rawTransaction);

					tx.sign(privateKey);
					let serializedTx = tx.serialize();
					//console.log('3rd')
					//ResponseMessage ='3rd'; 
					let hashObj = await sendrawtransaction(serializedTx);

					if (hashObj.response == '') {
						let hash = hashObj.hash;
						await sleep(30000);
						ResponseData = await getTransaction(hash);
						ResponseMessage = "Transaction successfully completed";
						ResponseCode = 200;
					} else {
						ResponseMessage = hashObj.response;
						ResponseCode = 400;
						return;
					}
				} else {
					ResponseMessage = gasPriceObj.response;
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


function getTransaction(hash) {
	var data;
	return new Promise(function (resolve, reject) {
		web3.eth.getTransaction(hash, function (err, transaction) {
			var date = new Date();
			var timestamp = date.getTime();
			var conf = web3.eth.getBlock("latest").number - transaction.blockNumber;
			data = {
				transaction: {
					hash: transaction.hash,
					currency: "ETH",
					from: transaction.from,
					to: transaction.to,
					amount: transaction.value / 10 ** 18,
					fee: transaction.gasPrice,
					n_confirmation: conf,
					block: transaction.blockNumber,
					link: `https://www.etherchain.org/tx/${hash}`
				},
				message: "",
				timestamp: timestamp,
				status: 200,
				success: true
			};
			resolve(data);
		})
	});
}


function getgasprice() {
	var gasprice;
	var response = "";
	return new Promise(function (resolve, reject) {
		web3.eth.getGasPrice(function (err, gsPrice) {
			if (err) {
				response = `Gas Bad Request ${err}`;
			} else {
				gasprice = gsPrice;
			}
			var obj = {
				response: response,
				gasprice: gasprice
			};
			resolve(obj);
		});
	});
}


function sendrawtransaction(serializedTx) {
	var hash;
	var response = "";
	return new Promise(function (resolve, reject) {
		web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"), function (err, hsh) {
			if (err) {
				response = `send Bad Request ${err}`;
			} else {
				hash = hsh;
			}
			var obj = {
				response: response,
				hash: hash
			};
			resolve(obj);
		});
	});
}


//-----------------------------Get Transaction----------------------------------------------

router.get("/track/:hash", async function (request, response) {
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
				if (hash.length == 66) {
					ResponseData = await getTransaction(hash);
					ResponseMessage = "Completed";
					ResponseCode = 200;

				} else if (hash.length == 42) {
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open("GET", 'http://api.etherscan.io/api?module=account&action=txlist&address=' + hash + '&startblock=0&endblock=99999999&sort=asc&limit=100', false); // false for synchronous request
					xmlHttp.send();
					var transactions = JSON.parse(xmlHttp.responseText);
					for (let i = 0; i < transactions.result.length; i++) {
						transactions.result[i].value = transactions.result[i].value / 10 ** 18;
					}
					ResponseData = {
						transaction: transactions.result
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

module.exports = router;