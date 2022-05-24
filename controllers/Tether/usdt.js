//This module help to listen request
var express = require("express");
var router = express.Router();
var axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3();

const Tx = require("ethereumjs-tx");

web3.setProvider(
    new web3.providers.HttpProvider(
        "https://mainnet.infura.io/t2utzUdkSyp5DgSxasQX"
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
        "name": "_upgradedAddress",
        "type": "address"
    }],
    "name": "deprecate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "deprecated",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_evilUser",
        "type": "address"
    }],
    "name": "addBlackList",
    "outputs": [],
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
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "upgradedAddress",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "balances",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "maximumFee",
    "outputs": [{
        "name": "",
        "type": "uint256"
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
    "constant": false,
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_maker",
        "type": "address"
    }],
    "name": "getBlackListStatus",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }, {
        "name": "",
        "type": "address"
    }],
    "name": "allowed",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "paused",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "who",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getOwner",
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
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "newBasisPoints",
        "type": "uint256"
    }, {
        "name": "newMaxFee",
        "type": "uint256"
    }],
    "name": "setParams",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "amount",
        "type": "uint256"
    }],
    "name": "issue",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "amount",
        "type": "uint256"
    }],
    "name": "redeem",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
    }, {
        "name": "_spender",
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
    "inputs": [],
    "name": "basisPointsRate",
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
        "name": "",
        "type": "address"
    }],
    "name": "isBlackListed",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_clearedUser",
        "type": "address"
    }],
    "name": "removeBlackList",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "MAX_UINT",
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
        "name": "newOwner",
        "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_blackListedUser",
        "type": "address"
    }],
    "name": "destroyBlackFunds",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "name": "_initialSupply",
        "type": "uint256"
    }, {
        "name": "_name",
        "type": "string"
    }, {
        "name": "_symbol",
        "type": "string"
    }, {
        "name": "_decimals",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Issue",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Redeem",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "newAddress",
        "type": "address"
    }],
    "name": "Deprecate",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "feeBasisPoints",
        "type": "uint256"
    }, {
        "indexed": false,
        "name": "maxFee",
        "type": "uint256"
    }],
    "name": "Params",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "_blackListedUser",
        "type": "address"
    }, {
        "indexed": false,
        "name": "_balance",
        "type": "uint256"
    }],
    "name": "DestroyedBlackFunds",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "_user",
        "type": "address"
    }],
    "name": "AddedBlackList",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "_user",
        "type": "address"
    }],
    "name": "RemovedBlackList",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "owner",
        "type": "address"
    }, {
        "indexed": true,
        "name": "spender",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "Approval",
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
        "name": "value",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [],
    "name": "Pause",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [],
    "name": "Unpause",
    "type": "event"
}];

var contractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

var date = new Date();
var timestamp = date.getTime();

//----------------------------------Send Tokens----------------------------------------------

router.post("/transfer", async function (request, response) {
    let fromAddress = request.body.from_address;
    let privateKey = request.body.from_private_key;
    let toAddress = request.body.to_address;
    let tokenValue = request.body.value;

    web3.eth.defaultAccount = fromAddress;

    let contract = web3.eth.contract(abi).at(contractAddress);

    let count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
    let data = contract.transfer.getData(toAddress, tokenValue);

    let gasPrice = web3.eth.gasPrice;
    let gasLimit = 200000;
    let rawTransaction = {
        "from": fromAddress,
        "nonce": web3.toHex(count),
        "gasPrice": web3.toHex(gasPrice),
        "gasLimit": web3.toHex(gasLimit),
        "to": contractAddress,
        "data": data,
        "chainId": 0x01
    };
    privateKey = Buffer.from(privateKey, 'hex');
    let tx = new Tx(rawTransaction);

    tx.sign(privateKey);
    let serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (!err) {
            web3.eth.getTransaction(hash, function (err, transaction) {
                response.json({
                    transaction: {
                        hash: transaction.hash,
                        from: transaction.from,
                        to: transaction.to,
                        amount: tokenValue,
                        currency: "USDT",
                        fee: transaction.gasPrice,
                        n_confirmation: transaction.transactionIndex,
                        link: `https://www.etherscan.io/tx/${hash}`
                    },
                    message: "",
                    timestamp: timestamp,
                    status: 200,
                    success: true
                });
            });
        } else {
            return response.status(400).json({
                msg: `Bad Request ${err}`
            });
        }
    });
});

router.get("/getBalance/:walletAddress", (req, response) => {
    let walletAddress = req.params.walletAddress;

    axios
        .get(
            "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
            contractAddress +
            "&address=" +
            walletAddress +
            "&tag=latest&apikey=YourApiKeyToken"
        )
        .then(res => {
            let balance = res.data.result;
            balance = balance / 10 ** 18;
            console.log(balance);
            response.json({
                balance: balance
            });
        });
});

router.get("/track/:walletAddress", (req, response) => {
    let walletAddress = req.params.walletAddress;

    axios
        .get(
            "http://api.etherscan.io/api?module=account&action=txlist&address=" +
            walletAddress +
            "&startblock=0&endblock=99999999&sort=asc"
        )
        .then(res => {
            let transactions = res.data;
            let _data = [];

            for (let i = 0; i < transactions.result.length; i++) {
                if (
                    String(transactions.result[i].to)
                    .toUpperCase()
                    .localeCompare(String(contractAddress).toUpperCase()) == 0
                )
                    _data.push(transactions.result[i]);
            }
            response.json({
                transaction: _data
            });
        });
});

module.exports = router;