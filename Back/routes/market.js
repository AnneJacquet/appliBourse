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
    let symbol = req.params.symbol;


    let matching = symbols.filter(action => action.startsWith(symbol.toUpperCase()));


    let result = [];

    let list = matching.join(',');
    // axios.get('https://api.iextrading.com/1.0/stock/market/batch?symbols=aapl,fb&types=price')
    axios.get('https://api.iextrading.com/1.0/stock/market/batch?symbols=' + list + '&types=company,price,chart&range=1m&last=1')
        .then(response => {
            matching.forEach(function (key) {
                if (Object.keys(response.data).includes(key)) {
                    let tmp = response.data[key];
                    if (tmp.price != null && tmp.chart.length > 0) {
                        let yesterday = tmp.chart[tmp.chart.length - 1];
                        let lastMonth = tmp.chart[0];
                        let action = {
                            symbol: key,
                            name: tmp.company.companyName,
                            priceActual: tmp.price,
                            yesterday : yesterday.close,
                            lastMonth : lastMonth.close
                        };
                        result.push(action);
                    }
                }
            });
            res.send(result);
        })
        .catch(error => console.log(error))

});

module.exports = router;