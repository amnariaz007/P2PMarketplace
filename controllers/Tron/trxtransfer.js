//This module help to listen request
var express = require("express");
var router = express.Router();
const TronWeb = require("tronweb");

var HttpProvider = TronWeb.providers.HttpProvider;
var fullNode = new HttpProvider("https://api.shasta.trongrid.io/");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io/"); // Solidity node http endpoint
const eventServer = "https://api.shasta.trongrid.io/"; // Contract events http endpoint


router.post('/transfer', async function (req, res) {


    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, req.body.from_private_key);
    let amount = req.body.value;
    amount = amount * 10 ** 6;

    tronWeb.trx.sendTransaction(req.body.to_address, amount).then(tx => {
        res.status(200).json({
            transaction: tx
        });
    }).catch(err => {
        res.status(400).json({
            Error: err
        });
    })
});

module.exports = router;