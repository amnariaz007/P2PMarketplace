//This module help to listen request
var express = require("express");
var router = express.Router();
const axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3();
// const Tx = require("ethereumjs-tx");
const Tx = require('ethereumjs-tx').Transaction
const Web3EthAccounts = require('web3-eth-accounts');
const req = require("express/lib/request");

const InputDataDecoder = require('ethereum-input-data-decoder');

web3.setProvider(
    new web3.providers.HttpProvider(
        "https://speedy-nodes-nyc.moralis.io/94c7d80f4b0e0b13e21a1432/eth/rinkeby"
    )
);

var abi = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_id", "type": "string" }], "name": "GetSeller_Buyer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_id", "type": "string" }], "name": "confirmDeliveryy", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "confirmDelivery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "currState", "outputs": [{ "internalType": "enum Escrow.State", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "deposit", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "dispute_Delivery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "address", "name": "_buyer", "type": "address" }, { "internalType": "address", "name": "_seller", "type": "address" }], "name": "getSeller_Buyer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "trading_data", "outputs": [{ "internalType": "address", "name": "seller", "type": "address" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bool", "name": "isPaid", "type": "bool" }], "stateMutability": "view", "type": "function" }]
const decoder = new InputDataDecoder(abi)

var contractAddress = "0x259D714422deD195a94E1bc13b2E96B83Adc076a";

var date = new Date();
var timestamp = date.getTime();
//***********************************GetSellerBuyer*****************************//

router.post("/getSellerBuyer", async function (request, response) {
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
            if (!request.body.from_private_key) {
                ResponseMessage += "from_private_key is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.Buyer) {
                ResponseMessage += "buyer is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.Seller) {
                ResponseMessage += "seller is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.id) {
                ResponseMessage += "id is missing \n";
                ValidationCheck = false;
            } else if (!request.body.id === parseInt(request.body.id)) {
                ResponseMessage += "id must be a number \n";
                ValidationCheck = false;
            }

            if (ValidationCheck == true) {
                let fromAddress = request.body.from_address;
                let privateKey = request.body.from_private_key;
                let id = request.body.id;
                let Seller = request.body.Seller;
                let Buyer = request.body.Buyer;



                if (fromAddress.length < 42) {
                    ResponseMessage = "Invalid from Address";
                    ResponseCode = 400;
                    return;
                }


                if (Seller.length < 42) {
                    ResponseMessage = "Invalid seller Address";
                    ResponseCode = 400;
                    return;
                } else if (Buyer.length < 42) {
                    ResponseMessage = "Invalid buyer Address";
                    ResponseCode = 400;
                    return;
                }

                web3.eth.defaultAccount = fromAddress;
                // tokenValue = tokenValue * (10 ** 6);

                // let contract = new web3.eth.Contract([ abi],  contractAddress);
                // let count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
                // let data = contract.transfer.getData(toAddress, tokenValue);
                let contract = new web3.eth.Contract(abi, contractAddress)
                //      {
                //     from: fromAddress
                // });

                let count = await web3.eth.getTransactionCount(fromAddress, 'latest');
                let data = contract.methods.getSeller_Buyer(id, Buyer, Seller).encodeABI();
                let gasPrice = web3.eth.gasPrice;
                let gasLimit = 200000;
                var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", "https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
                    contractAddress +
                    "&address=" +
                    fromAddress +
                    "&tag=latest&apikey=YourApiKeyToken", false); // false for synchronous request
                xmlHttp.send();
                var transactions = JSON.parse(xmlHttp.responseText);
                let balance = transactions.result;

                let rawTransaction = {
                    "from": fromAddress,
                    "nonce": web3.utils.toHex(count),
                    "gasPrice": web3.utils.toHex(200000000000),
                    "gasLimit": web3.utils.toHex(gasLimit),
                    "to": contractAddress,
                    "data": data,
                    // "chainId": 0x04
                };
                privateKey = Buffer.from(privateKey, 'hex');
                let tx = new Tx(rawTransaction, { 'chain': 'rinkeby' });
                console.log("This is tx", tx);

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



//**********************Deposite***************************





router.post("/deposit", async function (request, response) {
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
            if (!request.body.from_private_key) {
                ResponseMessage += "from_private_key is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.value) {
                ResponseMessage = "value is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.id) {
                ResponseMessage += "id is missing \n";
                ValidationCheck = false;
            } else if (!request.body.id === parseInt(request.body.id)) {
                ResponseMessage += "id must be a number \n";
                ValidationCheck = false;
            }

            if (ValidationCheck == true) {
                let fromAddress = request.body.from_address;
                let privateKey = request.body.from_private_key;
                let id = request.body.id;
                let Value = request.body.value;



                if (fromAddress.length < 42) {
                    ResponseMessage = "Invalid from Address";
                    ResponseCode = 400;
                    return;
                }


                web3.eth.defaultAccount = fromAddress;
                // tokenValue = tokenValue * (10 ** 6);

                // let contract = new web3.eth.Contract([ abi],  contractAddress);
                // let count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
                // let data = contract.transfer.getData(toAddress, tokenValue);
                let contract = new web3.eth.Contract(abi, contractAddress)
                //      {
                //     from: fromAddress
                // });

                let count = await web3.eth.getTransactionCount(fromAddress, 'latest');
                let data = contract.methods.deposit(id, Value).encodeABI();
                let gasPrice = web3.eth.gasPrice;
                let gasLimit = 200000;
                var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", "https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
                    contractAddress +
                    "&address=" +
                    fromAddress +
                    "&tag=latest&apikey=YourApiKeyToken", false); // false for synchronous request
                xmlHttp.send();
                var transactions = JSON.parse(xmlHttp.responseText);
                let balance = transactions.result;

                let rawTransaction = {
                    "from": fromAddress,
                    "nonce": web3.utils.toHex(count),
                    "gasPrice": web3.utils.toHex(200000000000),
                    "gasLimit": web3.utils.toHex(gasLimit),
                    "to": contractAddress,
                    "data": data,
                    // "chainId": 0x04
                };
                privateKey = Buffer.from(privateKey, 'hex');
                let tx = new Tx(rawTransaction, { 'chain': 'rinkeby' });
                console.log("This is tx", tx);

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

//***************************ConfirmDelivery************************//




router.post("/confirmDelivery", async function (request, response) {
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
            if (!request.body.from_private_key) {
                ResponseMessage += "from_private_key is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.value) {
                ResponseMessage = "value is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.id) {
                ResponseMessage += "id is missing \n";
                ValidationCheck = false;
            } else if (!request.body.id === parseInt(request.body.id)) {
                ResponseMessage += "id must be a number \n";
                ValidationCheck = false;
            }

            if (ValidationCheck == true) {
                let fromAddress = request.body.from_address;
                let privateKey = request.body.from_private_key;
                let id = request.body.id;
                let Value = request.body.value;



                if (fromAddress.length < 42) {
                    ResponseMessage = "Invalid from Address";
                    ResponseCode = 400;
                    return;
                }


                web3.eth.defaultAccount = fromAddress;
                // tokenValue = tokenValue * (10 ** 6);

                // let contract = new web3.eth.Contract([ abi],  contractAddress);
                // let count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
                // let data = contract.transfer.getData(toAddress, tokenValue);
                let contract = new web3.eth.Contract(abi, contractAddress)
                //      {
                //     from: fromAddress
                // });

                let count = await web3.eth.getTransactionCount(fromAddress, 'latest');
                let data = contract.methods.confirmDelivery(id, Value).encodeABI();
                let gasPrice = web3.eth.gasPrice;
                let gasLimit = 200000;
                var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", "https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
                    contractAddress +
                    "&address=" +
                    fromAddress +
                    "&tag=latest&apikey=YourApiKeyToken", false); // false for synchronous request
                xmlHttp.send();
                var transactions = JSON.parse(xmlHttp.responseText);
                let balance = transactions.result;

                let rawTransaction = {
                    "from": fromAddress,
                    "nonce": web3.utils.toHex(count),
                    "gasPrice": web3.utils.toHex(200000000000),
                    "gasLimit": web3.utils.toHex(gasLimit),
                    "to": contractAddress,
                    "data": data,
                    // "chainId": 0x04
                };
                privateKey = Buffer.from(privateKey, 'hex');
                let tx = new Tx(rawTransaction, { 'chain': 'rinkeby' });
                console.log("This is tx", tx);

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

//********************************Dispute-Delivery**********************************//

router.post("/disputeDelivery", async function (request, response) {
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
            if (!request.body.from_private_key) {
                ResponseMessage += "from_private_key is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.value) {
                ResponseMessage = "value is missing \n";
                ValidationCheck = false;
            }
            if (!request.body.id) {
                ResponseMessage += "id is missing \n";
                ValidationCheck = false;
            } else if (!request.body.id === parseInt(request.body.id)) {
                ResponseMessage += "id must be a number \n";
                ValidationCheck = false;
            }

            if (ValidationCheck == true) {
                let fromAddress = request.body.from_address;
                let privateKey = request.body.from_private_key;
                let id = request.body.id;
                let Value = request.body.value;



                if (fromAddress.length < 42) {
                    ResponseMessage = "Invalid from Address";
                    ResponseCode = 400;
                    return;
                }


                web3.eth.defaultAccount = fromAddress;
                // tokenValue = tokenValue * (10 ** 6);

                // let contract = new web3.eth.Contract([ abi],  contractAddress);
                // let count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
                // let data = contract.transfer.getData(toAddress, tokenValue);
                let contract = new web3.eth.Contract(abi, contractAddress)
                //      {
                //     from: fromAddress
                // });

                let count = await web3.eth.getTransactionCount(fromAddress, 'latest');
                let data = contract.methods.dispute_Delivery(id, Value).encodeABI();
                let gasPrice = web3.eth.gasPrice;
                let gasLimit = 200000;
                var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", "https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
                    contractAddress +
                    "&address=" +
                    fromAddress +
                    "&tag=latest&apikey=YourApiKeyToken", false); // false for synchronous request
                xmlHttp.send();
                var transactions = JSON.parse(xmlHttp.responseText);
                let balance = transactions.result;

                let rawTransaction = {
                    "from": fromAddress,
                    "nonce": web3.utils.toHex(count),
                    "gasPrice": web3.utils.toHex(200000000000),
                    "gasLimit": web3.utils.toHex(gasLimit),
                    "to": contractAddress,
                    "data": data,
                    // "chainId": 0x04
                };
                privateKey = Buffer.from(privateKey, 'hex');
                let tx = new Tx(rawTransaction, { 'chain': 'rinkeby' });
                console.log("This is tx", tx);

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



//**************************Trading_data**********************//

router.post("/tradingdata", async function (request, response) {
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
            if (!request.body.id) {
                ResponseMessage += "id is missing \n";
                ValidationCheck = false;
            } else if (!request.body.id === parseInt(request.body.id)) {
                ResponseMessage += "id must be a number \n";
                ValidationCheck = false;
            }

            if (ValidationCheck == true) {
                let fromAddress = request.body.from_address;
                let id = request.body.id;
               



                if (fromAddress.length < 42) {
                    ResponseMessage = "Invalid from Address";
                    ResponseCode = 400;
                    return;
                }


                web3.eth.defaultAccount = fromAddress;
                // tokenValue = tokenValue * (10 ** 6);

                // let contract = new web3.eth.Contract([ abi],  contractAddress);
                // let count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
                // let data = contract.transfer.getData(toAddress, tokenValue);
                let contract = new web3.eth.Contract(abi, contractAddress)
                //      {
                //     from: fromAddress
                // });

                let count = await web3.eth.getTransactionCount(fromAddress, 'latest');
                let data = contract.methods.trading_data(id).encodeABI();
                let gasPrice = web3.eth.gasPrice;
                let gasLimit = 200000;
                var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", "https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
                    contractAddress +
                    "&address=" +
                    fromAddress +
                    "&tag=latest&apikey=YourApiKeyToken", false); // false for synchronous request
                xmlHttp.send();
                var transactions = JSON.parse(xmlHttp.responseText);
                let balance = transactions.result;

                let rawTransaction = {
                    "from": fromAddress,
                    "nonce": web3.utils.toHex(count),
                    "gasPrice": web3.utils.toHex(200000000000),
                    "gasLimit": web3.utils.toHex(gasLimit),
                    "to": contractAddress,
                    "data": data,
                    // "chainId": 0x04
                };
                privateKey = Buffer.from(privateKey, 'hex');
                let tx = new Tx(rawTransaction, { 'chain': 'rinkeby' });
                console.log("This is tx", tx);

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
            let inputdecode = decoder.decodeData(transaction.input);
            data = {
                transaction: {
                    hash: transaction.hash,
                    from: transaction.from,
                    // to: transaction.toAddress,
                    amount: parseInt(inputdecode.inputs[1]) / 10 ** 6,
                    currency: "USDT",
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

function sendrawtransaction(serializedTx) {
    var hash;
    var response = "";
    return new Promise(function (resolve, reject) {
        web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"), function (err, hsh) {
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
module.exports = router;