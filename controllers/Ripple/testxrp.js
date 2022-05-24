const express = require('express');
const router = express.Router();

const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
    // server: 'wss://s2.ripple.com' 
    server: 'wss://s.altnet.rippletest.net:51233'
});
api.on('error', (errorMessage) => {
    console.log("error");
    return "error";
});
api.on('connected', () => {
    console.log("connected");
    return "connected";
});

// Create new un-active wallet of XRP
router.get('/create_wallet', function (req, res) {
    let newAddress = api.generateAddress();
    return res.status(200).json({
        newAddress
    });
});

// Get Balance of any Ripple acoount
router.get('/getBalance/:address', function (req, res) {
    api.connect().then(() => {
        if (api.isValidAddress(req.params.address)) {
            api.getBalances(req.params.address).then(balances => {
                res.json(balances);
            });
        } else {
            return res.status(400).json('Invalid Address')
        }
    });
});

// Get Transaction by hash
router.get('/track/:hash', function (req, res) {
    api.connect().then(() => {
        api.getTransaction(req.params.hash).then(transaction => {
            return res.send(transaction);
        });
    }).catch((err) => {
        return res.send('Not Found  ', err);
    });

});

// Get Transactions by wallet address
router.get('/trackAddress/:address', function (req, res) {
    api.connect().then(() => {
        if (api.isValidAddress(req.params.address)) {
            api.getTransactions(req.params.address).then(transactions => {
                res.json(transactions);
                console.log("transactions " , transactions)
            }).catch(err => {
                return res.status(400).json({
                    err: "Transaction ERROR happend : ",
                    err
                })
            });
        } else {
            return res.status(400).json('Invalid Address');
        }
    }).catch(err => {
        return res.status(400).json({
            error: "err happend : ",
            err
        })
    })
});


// Send Transaction
router.post('/transfer', function (req, res) {

    const address = req.body.from_address;
    const secret = req.body.from_private_key;
    const amount = req.body.value;
    const toAddress = req.body.toAddress;

    const payment = {
        source: {
            address: address,
            maxAmount: {
                value: amount,
                currency: 'XRP'
            }
        },
        destination: {
            address: toAddress,
            amount: {
                value: amount,
                currency: 'XRP'
            }
        }
    };

    // function quit(message) {
    //     console.log(message);
    //     process.exit(0);
    // }

    function fail(message) {
        console.error(message);
        process.exit(1);
    }

    api.connect().then(() => {
        console.log('Connected...');
        api.preparePayment(address, payment).then(prepared => {
            console.log('Payment transaction prepared...');
            const {
                signedTransaction
            } = api.sign(prepared.txJSON, secret);
            console.log('Payment transaction signed...');
            api.submit(signedTransaction).then(hash => {
                console.log(hash);
                return res.send(hash);
            });
        });
    }).catch(fail);


});

// Verify Transaction Hash
router.get('/verifyTransaction/:tx', function (req, res) {
    let tx = req.params.tx;
    api.connect().then(function () {
        api.getTransaction(tx).then(result => {
            return res.send({
                'status': result.outcome.result
            })
        }).then(() => {
            return api.disconnect();
        }).catch(err => {
            console.log(err)
            return res.status(400).json({
                'Error : ': err
            })
        });
    });
});

module.exports = router;