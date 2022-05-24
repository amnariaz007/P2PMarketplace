var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var XMLHttpRequest = require('xhr2');

app.use(bodyParser.json({
    type: 'application/json'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

var eth = require('./controllers/Ethereum/testeth');
// var xct = require('./controllers/Cryptochats/xct');
// var btc = require('./controllers/Bitcoin/btc');
// var usdt = require('./controllers/Tether/usdt')
// var xlm = require('./controllers/Stellar/xlm');
// var testxct = require('./controllers/Cryptochats/testXct');
var testusdt = require('./controllers/Tether/testUsdt');
var EscrowUsdt = require('./controllers/Tether/EscrowUsdt');

// var testbnt = require('./controllers/Bancor/testBnt')
// var testcrpt = require('./controllers/Crypterium/testCrpt')
// var testlatoken = require('./controllers/Latoken/testLatoken')
// // var eos = require('./controllers/Eos/eos');
// var testxrp = require('./controllers/Ripple/testxrp');
// var bch = require('./controllers/BitcoinCash/bch')
// var testbch = require('./controllers/BitcoinCash/testbch')
// var testltc = require('./controllers/Litcoin/testLtc')
// // var ltc = require('./controllers/Litcoin/ltc')
// var trx = require('./controllers/Tron/trx')
// var trxTransfer = require('./controllers/Tron/trxtransfer')
// var testBat = require('./controllers/BasicAttention/testbat')
// var testCvc = require('./controllers/Civic/testcvc')
// var testPoly = require('./controllers/PolyMath/testPoly')
// var testDash = require('./controllers/Dash/testDash')
// var testAugur = require('./controllers/Augur/testAugur')
// var komodo = require('./controllers/Komodo/kmd')
// var etc = require('./controllers/EthereumClassic/etc')
// var zch = require('./controllers/Zcash/zcash')

// app.use('/api/zch', zch);
// app.use('/api/etc', etc);
app.use('/api/eth', eth);
// app.use('/api/xct', xct);
// app.use('/api/btc', btc);
// app.use('/api/usdt', usdt);
// app.use('/api/xlm', xlm);
// app.use('/api/testxct', testxct);
app.use('/api/testusdt', testusdt);
app.use('/api/EscrowUsdt', EscrowUsdt);
// app.use('/api/testbnt', testbnt)
// app.use('/api/testcrpt', testcrpt)
// app.use('/api/testlatoken', testlatoken)
// app.use('/api/trx', trxTransfer)
// app.use('/api/testbat', testBat)
// app.use('/api/testcvc', testCvc)
// app.use('/api/testbch', testbch)
// app.use('/api/testltc', testltc)
// // app.use('/api/eos', eos);
// app.use('/api/testxrp', testxrp);
// app.use('/api/bch', bch);
// // app.use('/api/ltc', ltc);
// // app.use('/api/usdt', usdt);
// app.use('/api/trx', trx);
// app.use('/api/testpoly', testPoly);
// app.use('/api/testdash', testDash);
// app.use('/api/testaugur', testAugur);
// app.use('/api/kmd', komodo);

app.get('/', function (request, response) {

    response.contentType('application/json');
    response.end(JSON.stringify("Node is running"));

});

app.get('*', function (req, res) {
    return res.status(404).json({
        msg: 'Page Not Found'
    });
});

app.post('*', function (req, res) {
    return res.status(404).json({
        msg: 'Page Not Found'
    });
});

if (module === require.main) {

    var server = app.listen(process.env.PORT || 5000, function () {
        var port = server.address().port;
        console.log('App listening on port %s', port);
    });

}