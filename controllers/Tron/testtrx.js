let tronPayments = require("@faast/tron-payments")();

// tronPayments.getTransaction(
//   "5b17b92b12cc4f7da52e198de7ef6b5c3f96730dad5dd09e29c3b313c95a1a1f",
//   function(err, tx) {
//     console.log(tx);
//     console.log(err);
//   }
// );

// // let keys = tronPayments.generateNewKeys()
// // // console.log(keys.xpub)
// // // console.log(keys.xprv)

// // let depositAddress = tronPayments.bip44(keys.xpub, 1234) // for path m/44'/195'/0/1234
// // console.log(depositAddress)

// // let privateKey = tronPayments.getPrivateKey(keys.xprv, 1234) // for path m/44'/195'/0/1234
// // console.log(privateKey)

// // let address = tronPayments.privateToPublic('9FA3687129AE88D6A792E5EB90673C7E68EF7136DEBC82177772F8BEC8A19057') // for path m/44'/195'/0/1234
// // console.log(address) // TDMwBoHdgcdywBoecSUmbNbswBmRVaYroJ

// tronPayments.getBalanceFromPath('xpub6BzWqu4wMfnKvj3cWtskUSDvRdUruzgSNYi8jgrY6YXquPBzBsNJY91gS4nb4reKMxL2bkBqTRdXjy1eqsKVerc9KoiQdDzmfxd2cQF51Sn', 3, function (err, balance) {
//  console.log(balance)
// })

const TronWeb = require("tronweb");

const HttpProvider = Tro
nWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
const fullNode = new HttpProvider("https://api.shasta.trongrid.io/"); // Full node http endpoint
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io/"); // Solidity node http endpoint
const eventServer = "https://api.shasta.trongrid.io/"; // Contract events http endpoint

const privateKey =
    "9FA3687129AE88D6A792E5EB90673C7E68EF7136DEBC82177772F8BEC8A19057";

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

// const CryptoUtils = require("@tronscan/client/src/utils/crypto");
// const TransactionUtils = require("@tronscan/client/src/utils/transactionBuilder");

// async function transferContractTx() {
//     const privateKey =
//         "9FA3687129AE88D6A792E5EB90673C7E68EF7136DEBC82177772F8BEC8A19057";
//     const token = "TRX";
//     const fromAddress = CryptoUtils.pkToAddress(privateKey);
//     const toAddress = "TQ6pM81JDC2GhrUoNYtZGvPc7SvyqcemEu";
//     const amount = 100;

//     let transaction = TransactionUtils.buildTransferTransaction(
//         token,
//         fromAddress,
//         toAddress,
//         amount
//     );

//     //   console.log(transaction);
//     let signedTransaction = await CryptoUtils.signTransaction(
//         privateKey,
//         transaction
//     );
//     console.log(signedTransaction);
//     //   console.log(signedTransaction)
//     //   tronPayments.broadcastTransaction(signedTransaction, function(err, txHash) {
//     //     if (!err) console.log(txHash);
//     //     else console.log(err);
//     //   });

//     tronWeb.trx.sendRawTransaction(signedTransaction, function (err, txHash) {
//         if (!err) console.log(txHash);
//         else console.log(err);
//     })
// }
// transferContractTx();

// var from = "TDMwBoHdgcdywBoecSUmbNbswBmRVaYroJ";
// var to = "TBA6CypYJizwA9XdC7Ubgc5F1bxrQ7SqPt";
// var amount = 1;

// // // console.log(tronWeb.createAccount());

async function getBalance() {

    const privateKey =
        "9FA3687129AE88D6A792E5EB90673C7E68EF7136DEBC82177772F8BEC8A19057";

    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

    var create = await tronWeb.trx.sendTransaction(to, amount);
    console.log(create);

    //   // const address = 'TDMwBoHdgcdywBoecSUmbNbswBmRVaYroJ';

    //   // // The majority of the function calls are asynchronus,
    //   // // meaning that they cannot return the result instantly.
    //   // // These methods therefore return a promise, which you can await.
    //   // // const balance = await tronWeb.trx.getBalance(address);
    //   // console.log({
    //   //     balance
    //   // });

    //   // console.log(await tronWeb.trx.getTransactionInfo('d908efc47a5ad2b260121aaf530d06644adfdf2309aba404553d245e21c17548'))
    //   // console.log(await tronWeb.trx.getAccount('TDMwBoHdgcdywBoecSUmbNbswBmRVaYroJ'))

    //   // // You can also bind a `then` and `catch` method.
    //   // tronWeb.trx.getBalance(address).then(balance => {
    //   //     console.log({
    //   //         balance
    //   //     });
    //   // }).catch(err => console.error(err));

    //   // // If you'd like to use a similar API to Web3, provide a callback function.
    //   // tronWeb.trx.getBalance(address, (err, balance) => {
    //   //     if (err)
    //   //         return console.error(err);

    //   //     console.log({
    //   //         balance
    //   //     });
    //   // // });
}

// getBalance();