var express = require('express');
var router = express.Router();
var request = require('request');


/* GET ALL SYMBOL */
router.get('/', function (req, res) {
    let market = [];

    request('https://api.iextrading.com/1.0/ref-data/symbols', function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);

        {
            JSON.parse(body).forEach(function (data) {
                let action = {name: data.name, symbol: data.symbol};
                console.log(action);
                market.push(action);

            });
            res.send(market);
        }

    });


});

module.exports = router;
