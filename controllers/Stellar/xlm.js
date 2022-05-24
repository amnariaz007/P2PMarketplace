var StellarSdk = require('stellar-sdk');
var request = require('request');
var express = require('express');
var router = express.Router();
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


// Create key pair
router.get('/create_wallet', function (req, res) {
    // var server = new StellarSdk.Server('https://horizon-mainnet.stellar.org');

    var pair = StellarSdk.Keypair.random();
    var secret_key = pair.secret();
    var public_key = pair.publicKey();
    var date = new Date();
    var timestamp = date.getTime();

    console.log("Secret key: " + secret_key);
    console.log("Public key: " + public_key);

    var keyPair = {
        'secret': secret_key,
        'public': public_key
    };

    // https://horizon-testnet.stellar.org/transactions/4406645ab35eb5d658089e5798e4544b44f5d6c2c1dc8f39e78984693b344490
    // {
    //     "secret": "SDUKJ5SFLZ5CGA6PNGYIAUXMWC2DGNXJBOJYLBDKDRBTMFENFFBE5A3H",
    //     "public": "GCHPJXXLBNQZUCSCIZI273DCLOFF3XBYDWRB4YH7ATUSAQA3YOZ4DVYQ"
    // }

    request.get({
        url: 'https://horizon-testnet.stellar.org/friendbot/',
        qs: {
            addr: public_key
        },
        json: true
    }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.error('ERROR!', error || body);
        } else {
            console.log('SUCCESS! You have a new account :)\n', body);
        }
        request.get({
            url: 'https://horizon-testnet.stellar.org/friendbot/',
            qs: {
                addr: public_key
            },
            json: true
        }, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.error('ERROR!', error || body);
            } else {
                console.log('SUCCESS! You have a new account :)\n', body);
            }
        });

    });


    res.json({
        wallet: {
            private: keyPair.secret,
            public: keyPair.public,
            currency: "XLM",
            balance: 0,
            create_date: date,
        },
        message: "",
        timestamp: timestamp,
        status: 200,
        success: true
    });

});


// Get Balance
router.get('/getBalance/:wallet_address', function (request, res) {
    // var server = new StellarSdk.Server('https://horizon.stellar.org'); //For Mainnet
    // var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    var balanceList = [];

    walletAddress = request.params.wallet_Address;
    console.log("its serverr,: :", server)
    
    server.loadAccount(walletAddress).then(function (account) {
        console.log('Balances for account: ' + walletAddress);

        account.balances.forEach(function (balance) {
            console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
            var singleBalance = {};
            singleBalance['currency'] = balance.asset_type;
            singleBalance['Balance'] = balance.balance;
            balanceList.push(singleBalance);
        });
        res.contentType('application/json');
        res.end(JSON.stringify(balanceList));
    });
});


//-----------------------------Get Transactions of Account or by hash----------------------------------------------
router.get('/track/wallet_address', function (req) {
    let walletAddress = req.params.wallet_address;
    axios
        .get(
            'https://horizon-testnet.stellar.org/accounts/' + walletAddress + '/payments'
        )
        .then(res => {
            let transactions = res.data._embedded;

            let _data = [];

            for (let i = 0; i < transactions.records.length; i++) {

                if (
                    String(transactions.records[i].transaction_hash)
                    .toUpperCase()
                    .localeCompare(String(req.body.hash).toUpperCase()) == 0
                )
                    _data.push(transactions.records[i]);
            }

            console.log(_data)
        }).catch(err => console.log("Hash not Found " + err))
});



// // Send Transaction => Stellar
router.post('/transfer',function(req,res,next){

    var sourceKeys = StellarSdk.Keypair
      .fromSecret(req.body.from_private_key);
    var destinationId = req.body.to_address;
    // Transaction will hold a built transaction we can resubmit if the result is unknown.
    var transaction;
  
    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the transaction fee when the transaction fails.
    server.loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch(StellarSdk.NotFoundError, function (error) {
        throw new Error('The destination account does not exist!');
      })
      // If there was no error, load up-to-date information on your account.
      .then(function() {
        return server.loadAccount(sourceKeys.publicKey());
      })
      .then(function(sourceAccount) {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount)
          .addOperation(StellarSdk.Operation.payment({
            destination: destinationId,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: StellarSdk.Asset.native(),
            amount: req.body.value
          }))
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text('Test Transaction'))
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
      })
      .then(function(result) {
        console.log('Success! Results:', result);
            res.send(JSON.stringify(result));
      })
      .catch(function(error) {
        console.error('Something went wrong!', error);
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        // server.submitTransaction(transaction);
      });
  });
  



// router.post('/transfer', function (request, response) {

//     var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

//     var senderSecret = request.body.from_private_key;
//     var destinationId = request.body.to_address;
//     var currencyAmount = request.body.value;

//     var sourceKeys = StellarSdk.Keypair
//         .fromSecret(senderSecret);

//     var transaction;

//     server.loadAccount(destinationId)
//         // If the account is not found, surface a nicer error message for logging.
//         .catch(StellarSdk.NotFoundError, function (error) {
//             throw new Error('The destination account does not exist!');
//         })
//         // If there was no error, load up-to-date information on your account.
//         .then(function () {
//             console.log(sourceKeys.publicKey());
//             return server.loadAccount(sourceKeys.publicKey());
//         })
//         .then(function (sourceAccount) {
//             // Start building the transaction.
//             transaction = new StellarSdk.TransactionBuilder(sourceAccount)
//                 .addOperation(StellarSdk.Operation.payment({
//                     destination: destinationId,
//                     // Because Stellar allows transaction in many currencies, you must
//                     // specify the asset type. The special "native" asset represents Lumens.
//                     asset: StellarSdk.Asset.native(),
//                     amount: currencyAmount
//                 }))
//                 .addMemo(StellarSdk.Memo.text('Test Transaction'))
//                 .build();
//             // Sign the transaction to prove you are actually the person sending it.
//             transaction.sign(sourceKeys);
//             // And finally, send it off to Stellar!
//             return server.submitTransaction(transaction);
//         })
//         .then(function (result) {
//             console.log('Success! Results:', result);
//             response.contentType('application/json');
//             response.end(JSON.stringify(result));
//         })
//         .catch(function (error) {
//             console.error('Something went wrong!', error);
//         });

// });



// var bchAddress = express.Router();
// bchAddress.get('/', function(request, response){

//     const privateKey = new bch.PrivateKey();
//     const addr = privateKey.toAddress();

//     const Address = bch.Address;
//     const BitpayFormat = Address.BitpayFormat;
//     const CashAddrFormat = Address.CashAddrFormat;

//     const address = new Address(addr);

//     var public_key = address.toString(CashAddrFormat);
//     var secret_key = privateKey.toString();    

//     console.log("Public Key: "+ public_key);
//     console.log("Secret Key: "+ secret_key);

//     var keyPair = {'secret': secret_key, 'public': public_key};

//     response.contentType('application/json');
//     response.end(JSON.stringify(keyPair));
// })
// app.use('/bch-address', bchAddress);


// var chekcValid = express.Router();
// chekcValid.get('/', function(request, response){


// var destinationId = "GAHGICZOZ267LIM64HZJTKJOOKOLEVU22FCFQUFO5KMCMPYAVNDG4LU6";
//   console.log("the adress is",destinationId);

//   server.loadAccount(destinationId)
//     // If the account is not found, surface a nicer error message for logging.
//     // If there was no error, load up-to-date information on your account.
//     .then(function() {
//       response.send("Fahad");
//     })
//     .catch(StellarSdk.NotFoundError, function (error) {
//       response.send("account does not exist");
//     })

// })
// app.use('/check-address', chekcValid);





// // Check Trust
// var checkAddr = express.Router();
// checkAddr.post('/', function (request, response){

//   var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

//   var accountId = request.body.addr;
//   console.log("the adress is",accountId);

//   server.loadAccount(accountId)
//   .catch(StellarSdk.NotFoundError, function (error) {
//    // response.contentType('application/json');
//     response.end(JSON.stringify("unvalid"));


//   })
//   .then(function() {
//    // response.contentType('application/json');
//     response.end(JSON.stringify("valid"));
//   })
// });
// app.use('/check-addr', checkAddr);

module.exports = router;