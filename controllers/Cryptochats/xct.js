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
    "name": "_from",
    "type": "address"
  }, {
    "indexed": true,
    "name": "_to",
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
}];

var contractAddress = "0x3e423d7BC073d75fd3002B277B1190f4cdaeB385";

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
            currency: "XCT",
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