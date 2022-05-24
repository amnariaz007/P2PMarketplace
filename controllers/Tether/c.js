const Web3 = require('web3')
const Tx = require("ethereumjs-tx").Transactio
const web3 = new Web3 ("https://speedy-nodes-nyc.moralis.io/94c7d80f4b0e0b13e21a1432/eth/rinkeby")

const account1 = '' // Your account address 1
const account2 = '' // Your account address 2

const privateKey1 = Buffer.from('YOUR_PRIVATE_KEY_1', 'hex')
const privateKey2 = Buffer.from('YOUR_PRIVATE_KEY_2', 'hex')

// Read the deployed contract - get the addresss from Etherscan
const contractAddress = "0x727Ff46767fD1CB29EAc8D85509555469414cF48"
const abi = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_id", "type": "string" }], "name": "GetSeller_Buyer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "string", "name": "_id", "type": "string" }], "name": "confirmDeliveryy", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "confirmDelivery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "currState", "outputs": [{ "internalType": "enum Escrow.State", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "deposit", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }], "name": "dispute_Delivery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "address", "name": "_buyer", "type": "address" }, { "internalType": "address", "name": "_seller", "type": "address" }], "name": "getSeller_Buyer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }], "name": "search", "outputs": [{ "components": [{ "internalType": "address", "name": "seller", "type": "address" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bool", "name": "isPaid", "type": "bool" }], "internalType": "struct Escrow.trading", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "trading_data", "outputs": [{ "internalType": "address", "name": "seller", "type": "address" }, { "internalType": "address", "name": "buyer", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bool", "name": "isPaid", "type": "bool" }], "stateMutability": "view", "type": "function" }]
fromAddress = '0x3E2e6a6570b37fE80B45C70c39D1404aA1011557'
const contract = new web3.eth.Contract(abi, contractAddress)

// Transfer some tokens
web3.eth.getTransactionCount(account1, (err, txCount) => {

//   const txObject = {
    
//     nonce:    web3.utils.toHex(txCount),
//     gasLimit: web3.utils.toHex(800000), // Raise the gas limit to a much higher amount
//     gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
//     to: contractAddress,
    
//   }

//   const tx = new Tx(txObject)
//   tx.sign(privateKey1)

//   const serializedTx = tx.serialize()
//   const raw = '0x' + serializedTx.toString('hex')

  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    console.log('err:', err, 'txHash:', txHash)
    // Use this txHash to find the contract on Etherscan!
  })
})

// Check Token balance for account1
contract.methods.search().call((err, balance) => {
  console.log({ err, balance })
})

// // Check Token balance for account2
// contract.methods.balanceOf(account2).call((err, balance) => {
//   console.log({ err, balance })
// })