//This module help to listen request
var express = require('express');
var router = express.Router();
const axios = require('axios');
// const bch = require('bchaddrjs');
const bch = require('bitcore-lib-cash')


// // ---------------------------------Create Account----------------------------------------------
router.get("/create_wallet", async function (request, res) {
    let network = bch.Networks.mainnet;
    let priv = new bch.PrivateKey(network);
    let add = priv.toAddress().toString(bch.Address.DefaultFormat);


    res.json({
        wallet: {
            privateKey: priv.bn,
            cashAddress: add.replace("bchtest:", "")
        }
    })
});

router.get('/getBalance/:walletAddress', function (req, response) {
    axios.get(`https://api.bitcore.io/api/BCH/mainnet/address/${req.params.walletAddress}/?noTxList=1`).then(res => {
        balance = res.data.balance;
        response.json({
            balance: balance
        })
    }).catch(err => {
        res.json(`Error occured ${err}`)
    })
});

router.get('/track/:hash', async function (req, response) {

    axios.get(`https://api.bitcore.io/api/BCH/mainnet/tx/${req.params.hash}`)
        .then((res) => {
            const transactions = res.data;

            response.json({
                transaction: {
                    hash: transactions.txid,
                    from: transactions.vin[0].addr,
                    to: transactions.vout[0].scriptPubKey.addresses[0],
                    amount: transactions.vout[0].value,
                    fee: transactions.fees,
                    block: transactions.blockheight,
                    n_confirmation: transactions.confirmations,
                    link: `https://blockexplorer.com/tx/${req.params.hash}`
                },
                message: "",
                timestamp: transactions.time,
                status: 200,
                success: true
            });

        }).catch(err => response.status(404).json({
            hash: `Hash not Found ${err}`
        }))

});

router.get('/trackAddress/:walletAddress', function (req, res) {
    axios.get(
        "https://api.bitcore.io/api/BCH/mainnet/txs/?address=" + req.params.walletAddress
    ).then(transaction =>
        res.status(200).json({
            transaction: transaction.data
        })).catch(err => {
        res.status(404).send({
            walletAddress: `${req.params.walletAddress} not found`
        })
    })
});

router.post('/transfer', function (req, res) {

    let from = request.body.from_address;
    let to = request.body.to_address;
    let privKeyWIF = request.body.from_private_key; //Private key in WIF form (Can generate this from bitcoinlib-js)
    let value = request.body.value;

    axios.get(`https://api.bitcore.io/api/BCH/mainnet/address/${from}/utxo`).then(res => {

        var tx = bitcore.Transaction();
        tx.from(res.data);
        tx.to(to, (value)); // 1000 satoshis will be taken as fee.
        tx.fee(50000);
        tx.change(from);
        tx.sign(privKeyWIF);

        //   /insight-api/tx/send
        axios.post("https://api.bitcore.io/api/BCH/mainnet/tx/send", {
            "rawtx": tx.serialize()
        }).then(response => {
            res.json({
                transaction: response.data.txid
            })
        });
    }).catch(err => {
        res.status(400).json({
            error: `unexpected error occured ${err}`
        })
    });

});

module.exports = router;