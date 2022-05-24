//This module help to listen request
var express = require('express');
var router = express.Router();
const axios = require('axios');
let komodo = require("bitcore-lib-komodo");


// // ---------------------------------Create Account----------------------------------------------
router.get("/create_wallet", async function (request, res) {
    let network = komodo.Networks.livenet;
    let priv = new komodo.PrivateKey();
    let add = priv.toAddress().toString('hex');

    console.log(priv)
    console.log(add)
    res.json({
        wallet: {
            privateKey: priv.bn,
            liteAddress: add
        }
    })
});

router.get('/getBalance/:walletAddress', function (req, response) {
    axios.get(`https://kmdexplorer.io/insight-api-komodo/addr/${req.params.walletAddress}/?noTxList=1`).then(res => {
        balance = res.data.balance;
        response.json({
            balance: balance
        })
    }).catch(err => {
        response.json(`Error occured ${err}`)
    })
});

router.get('/track/:hash', async function (req, response) {

    axios.get(`hhttps://kmdexplorer.io/insight-api-komodo/tx/${req.params.hash}`)
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
                    link: `https://kmdexplorer.io/tx/${req.params.hash}`
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
        "https://kmdexplorer.io/insight-api-komodo/tx/?address=" + req.params.walletAddress
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

    axios.get(`https://kmdexplorer.io/insight-api-komodo/addr/${from}/utxo`).then(res => {

        var tx = bitcore.Transaction();
        tx.from(res.data);
        tx.to(to, (value)); // 1000 satoshis will be taken as fee.
        tx.fee(50000);
        tx.change(from);
        tx.sign(privKeyWIF);

        //   /insight-api/tx/send
        axios.post("https://kmdexplorer.io/insight-api-komodo/tx/send", {
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