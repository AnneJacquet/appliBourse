var express = require('express');
var router = express.Router();
var axios = require('axios');


prepare();
let symbols = [];


function prepare() {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
    //get all symbols
        .then(response => getAllSymbol(response))
        .catch(error => {
            console.log(error);
        });
}


function getAllSymbol(response) {
    response.data.forEach(function (data) {
        if (data.symbol.match(/^[0-9a-zA-Z]+$/)) {
            symbols.push(data.symbol);
        }
    });
    console.log("number of symbols " + symbols.length);
}


/**
 * RETURN ALL ACTIONS WHICH SYMBOL MATCHES
 */
router.get('/:symbol', function (req, res) {

    let result = [];

    let symbol = req.params.symbol;
    let matching = symbols.filter(action => action.startsWith(symbol.toUpperCase()));
    let list = matching.join(',');


    if (matching.length === 0) {
        res.send(result);
    } else {
        axios.get('https://api.iextrading.com/1.0/stock/market/batch?symbols=' + list + '&types=company,price,ohlc')
            .then(response => {
                //we have to wait and check each symbol before sending a response
                let promises = matching.map((key) => {
                    return new Promise((resolve) => {
                        if (Object.keys(response.data).includes(key)) {
                            let tmp = response.data[key];
                            if (tmp.price != null) {
                                let action = {
                                    symbol: key,
                                    name: tmp.company.companyName,
                                    priceActual: tmp.price,
                                    begin: tmp.ohlc.open.price
                                };
                                result.push(action);
                            }
                        }
                        resolve();
                    });
                });

                Promise.all(promises).then(() => {
                    res.send(result);
                });

            })
            .catch(error => console.log(error))
    }

});

module.exports = router;