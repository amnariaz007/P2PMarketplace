//This module help to listen request
var express = require("express");
var router = express.Router();
var axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3();

const Tx = require("ethereumjs-tx");

const InputDataDecoder = require('ethereum-input-data-decoder');


web3.setProvider(
    new web3.providers.HttpProvider(
        "https://rinkeby.infura.io/t2utzUdkSyp5DgSxasQX"
    )
);

var abi = [{
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "spender",
        "type": "address"
    }, {
        "name": "tokens",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "from",
        "type": "address"
    }, {
        "name": "to",
        "type": "address"
    }, {
        "name": "tokens",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
        "name": "",
        "type": "uint8"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "_totalSupply",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "tokenOwner",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "name": "balance",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "a",
        "type": "uint256"
    }, {
        "name": "b",
        "type": "uint256"
    }],
    "name": "safeSub",
    "outputs": [{
        "name": "c",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "to",
        "type": "address"
    }, {
        "name": "tokens",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "a",
        "type": "uint256"
    }, {
        "name": "b",
        "type": "uint256"
    }],
    "name": "safeDiv",
    "outputs": [{
        "name": "c",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "spender",
        "type": "address"
    }, {
        "name": "tokens",
        "type": "uint256"
    }, {
        "name": "data",
        "type": "bytes"
    }],
    "name": "approveAndCall",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "a",
        "type": "uint256"
    }, {
        "name": "b",
        "type": "uint256"
    }],
    "name": "safeMul",
    "outputs": [{
        "name": "c",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "newOwner",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "tokenAddress",
        "type": "address"
    }, {
        "name": "tokens",
        "type": "uint256"
    }],
    "name": "transferAnyERC20Token",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "tokenOwner",
        "type": "address"
    }, {
        "name": "spender",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
        "name": "remaining",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "a",
        "type": "uint256"
    }, {
        "name": "b",
        "type": "uint256"
    }],
    "name": "safeAdd",
    "outputs": [{
        "name": "c",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_newOwner",
        "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "to",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "to",
        "type": "address"
    }, {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "tokenOwner",
        "type": "address"
    }, {
        "indexed": true,
        "name": "spender",
        "type": "address"
    }, {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
}]

const decoder = new InputDataDecoder(abi)

var contractAddress = "0x95521591240bD6011fCea86bfc714a28D69d03F3";

var date = new Date();
var timestamp = date.getTime();

//----------------------------------Send Tokens----------------------------------------------

router.post("/transfer", async function (request, response) {
var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	
	try {
		if(request.body) {
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
			
			if(ValidationCheck == true) {
				let fromAddress = request.body.from_address;
				let privateKey = request.body.from_private_key;
				let toAddress = request.body.to_address;
				let tokenValue = request.body.value;


				if (fromAddress.length < 42) {
					ResponseMessage = "Invalid From Address";
					ResponseCode = 400;
					return;
				} else if (toAddress.length < 42) {
					ResponseMessage = "Invalid To Address";
					ResponseCode = 400;
					return;
				}
    
				web3.eth.defaultAccount = fromAddress;
				tokenValue = tokenValue * (10 ** 2);

				let contract = web3.eth.contract(abi).at(contractAddress);
				let count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
				let data = contract.transfer.getData(toAddress, tokenValue);
				let gasPrice = web3.eth.gasPrice;
				let gasLimit = 200000;
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open( "GET", "https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
					contractAddress +
					"&address=" +
					fromAddress +
					"&tag=latest&apikey=YourApiKeyToken", false ); // false for synchronous request
				xmlHttp.send();
				var transactions = JSON.parse(xmlHttp.responseText);
				let balance = transactions.result;
				if(balance >= tokenValue + gasLimit) {
					let rawTransaction = {
						"from": fromAddress,
						"nonce": web3.toHex(count),
						"gasPrice": web3.toHex(gasPrice),
						"gasLimit": web3.toHex(gasLimit),
						"to": contractAddress,
						"data": data,
						"chainId": 0x04
					};
					privateKey = Buffer.from(privateKey, 'hex');
					let tx = new Tx(rawTransaction);

					tx.sign(privateKey);
					let serializedTx = tx.serialize();
					let hashObj = await sendrawtransaction(serializedTx);
					
					if (hashObj.response == '') {
						let hash = hashObj.hash;
						ResponseData = await getTransaction(hash);
						ResponseMessage = "Transaction successfully completed";
						ResponseCode = 200;
					} else {
						ResponseMessage = hashObj.response;
						ResponseCode = 400;
						return;
					}
				} else {
					ResponseMessage = "Balance is insufficent";
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
			code : ResponseCode,
			data : ResponseData,
			msg : ResponseMessage
		});
	}
});

router.get("/getBalance/:walletAddress", (req, response) => {
	var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	try {
		if(req.params) {
			if (!req.params.walletAddress) {
				ResponseMessage = "wallet address is missing \n";
				ResponseCode = 206;
			} else {
				var date = new Date();
				var timestamp = date.getTime();
				let walletAddress = req.params.walletAddress;
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open( "GET", "https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
					contractAddress +
					"&address=" +
					walletAddress +
					"&tag=latest&apikey=YourApiKeyToken", false ); // false for synchronous request
				xmlHttp.send();
				var transactions = JSON.parse(xmlHttp.responseText);
				let balance = transactions.result;
				balance = balance / 10 ** 2;
				ResponseData = {
					wallet: {
						balance: balance
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
			code : ResponseCode,
			data : ResponseData,
			msg : ResponseMessage
		});
	}
});

function getTransaction(hash) {
	var data;
	return new Promise(function(resolve, reject) {
		web3.eth.getTransaction(hash, function (err, transaction) {
			var date = new Date();
			var timestamp = date.getTime();
			let inputdecode = decoder.decodeData(transaction.input);
			data = {
				transaction: {
					hash: transaction.hash,
					from: transaction.from,
					to: transaction.toAddress,
					amount: parseInt(inputdecode.inputs[1]) / 10 ** 2,
					currency: "XCT",
					fee: transaction.gasPrice,
					n_confirmation: transaction.transactionIndex,
					link: `https://rinkeby.etherscan.io/tx/${hash}`
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

router.get("/track/:walletAddress", async function(req, response) {
	var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	try {
		if(req.params) {
			if (!req.params.walletAddress) {
				ResponseMessage = "hash / wallet address is missing \n";
				ResponseCode = 206;
			} else {
				let hash = req.params.walletAddress;
				
				if (hash.length == 66) {
					ResponseData = await getTransaction(hash);
					ResponseMessage = "Completed";
					ResponseCode = 200;

				} else if (hash.length == 42) {
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open( "GET", "http://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=" + hash + "&startblock=0&endblock=99999999&sort=asc&limit=100", false ); // false for synchronous request
					xmlHttp.send();
					var transactions = JSON.parse(xmlHttp.responseText);
					let _data = [];
					for (let i = 0; i < transactions.result.length; i++) {
						if (String(transactions.result[i].contractAddress).toUpperCase().localeCompare(String(contractAddress).toUpperCase()) == 0) {
							transactions.result[i].value = transactions.result[i].value / 10 ** 2;
							_data.push(transactions.result[i]);
						}
					}
					ResponseData = {
						transaction: _data
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
			code : ResponseCode,
			data : ResponseData,
			msg : ResponseMessage
		});
	}
});


function sendrawtransaction(serializedTx) {
	var hash;
	var response = "";
	return new Promise(function(resolve, reject) {
		web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"), function ( err, hsh ) {
			if (err) {
				response = `send Bad Request ${err}`;
			} else {
				hash = hsh;
			} 
			var obj = {
				response:  response,
				hash: hash
			};
			resolve(obj);
		});
	});
}


module.exports = router;