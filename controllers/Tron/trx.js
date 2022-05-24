//This module help to listen request
var express = require("express");
var router = express.Router();
const TronWeb = require("tronweb");
const tronPayments = require("@faast/tron-payments")();


const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = new HttpProvider("https://api.shasta.trongrid.io/"); // Full node http endpoint
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io/"); // Solidity node http endpoint
const eventServer = "https://api.shasta.trongrid.io/"; // Contract events http endpoint

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

router.get('/create_wallet', async function (req, res) {

    const account = await tronWeb.createAccount();
    res.status(200).json({
        wallet: {
            privateKey: account.privateKey,
            publicAddress: account.address.base58
        }
    })
});

router.get('/getBalance/:walletAddress', async function (req, res) {

    let balance = await tronWeb.trx.getBalance(req.params.walletAddress);
    balance = balance / 10 ** 6;
    res.status(200).json({
        balance: balance
    })
});

router.get('/track/:hash', async function (req, res) {
    tronPayments.getTransaction(
        req.params.hash,
        function (err, tx) {
            if (!err) {
                res.status(200).json({
                    transaction: tx
                })
            } else {
                res.status(404).json({
                    error: err
                })
            }
        }
    );
});

router.get('/trackAddress/:walletAddress', async function (req, res) {

    let wallet = await tronWeb.trx.getAccount(req.params.walletAddress);
    res.status(200).json({
        wallet: wallet
    })
});

router.get('/import/:privateKey', async function (req, res) {

    let wallet = tronPayments.privateToPublic(req.params.privateKey) // for path m/44'/195'/0/1234

    res.status(200).json({
        wallet: wallet
    })
});

// router.post('/transfer', async function (req, res) {
//     var create = await tronWeb.trx.sendTransaction(to, amount);
//       console.log(create);

// });

module.exports = router;