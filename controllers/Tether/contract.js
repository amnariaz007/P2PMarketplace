var express = require("express");
var router = express.Router();
var axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3();

const Tx = require("ethereumjs-tx").Transaction
const InputDataDecoder = require('ethereum-input-data-decoder');
let abi = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_id", "type": "string" }], "name": "GetSeller_Buyer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_id", "type": "string" }], "name": "confirmDeliveryy", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "confirmDelivery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "currState", "outputs": [{ "internalType": "enum Escrow.State", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "deposit", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "dispute_Delivery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "address", "name": "_buyer", "type": "address" }, { "internalType": "address", "name": "_seller", "type": "address" }], "name": "getSeller_Buyer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }], "name": "search", "outputs": [{ "components": [{ "internalType": "address", "name": "seller", "type": "address" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bool", "name": "isPaid", "type": "bool" }], "internalType": "struct Escrow.trading", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "trading_data", "outputs": [{ "internalType": "address", "name": "seller", "type": "address" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bool", "name": "isPaid", "type": "bool" }], "stateMutability": "view", "type": "function" }]
const decoder = new InputDataDecoder(abi)
 var contractAddress = "0x727Ff46767fD1CB29EAc8D85509555469414cF48";
 web3.setProvider(
    new web3.providers.HttpProvider(
        "https://speedy-nodes-nyc.moralis.io/94c7d80f4b0e0b13e21a1432/eth/rinkeby"
    )
);
let contract = new web3.eth.Contract(abi, contractAddress);
//    {
//   from : "0x3E2e6a6570b37fE80B45C70c39D1404aA1011557"
// });
contract.methods.trading_data("1").call( {from : "0x727Ff46767fD1CB29EAc8D85509555469414cF48"}, function (err,balance) {
  console.log(err,balance);
})

  // const serializedTx = tx.serialize()
  // const raw = '0x' + serializedTx.toString('hex')
const Buyer = '0x696697ac9272d53E700336784619AF7D07a32569' // Your account address 1
const Seller = '0x696697ac9272d53E700336784619AF7D07a32569' // Your account address 2
contract.methods.getSeller_Buyer( 1 ,Buyer  , Seller   ).call((err, balance) => {
  console.log({ err, balance })
})
// contract.methods.deposit ( 1, 12 ).call((err, balance) => {
//   console.log({ err, balance })
// })
// contract.methods.confirmDelivery( 1 , 12).call((err, balance) => {
//   console.log({ err, balance })
// })
 
// contract.method.search( _id ).call().then(console.log);






