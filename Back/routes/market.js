var express = require('express');
var router = express.Router();
var axios = require('axios');


prepare();
let market = [];


function prepare() {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
    //get all symbols
        .then(response => getAllSymbol(response))
        //split by chunks of 100
        .then(symbols => chunkMap(symbols, 100))
        .then(map => getPrice(map))
        .catch(error => {
            console.log(error);
        });
}


function getAllSymbol(response) {
    let symbols = new Map();
    response.data.forEach(function (data) {
        symbols.set(data.symbol, data.name);
    });
    console.log("number of symbols " + symbols.size);
    return symbols;
}


function chunkMap(map, chunkSize) {
    let chunkedMaps = [];
    let mapAsArray = Array.from(map);
    for (let i = 0; i < map.size; i += chunkSize) {
        let chunked = mapAsArray.slice(i, i + chunkSize);
        chunkedMaps.push(new Map(chunked))
    }
    console.log("number of chunks " + chunkedMaps.length);
    return chunkedMaps
}

function getPrice(chunkedMaps) {
    chunkedMaps.forEach(function (map) {
        let list = Array.from(map.keys()).join(',');
        // axios.get('https://api.iextrading.com/1.0/stock/market/batch?symbols=aapl,fb&types=price')
        axios.get('https://api.iextrading.com/1.0/stock/market/batch?symbols=' + list + '+&types=price')
            .then(response => {
                map.forEach(function (value, key) {
                    if (Object.keys(response.data).includes(key)){
                        let tmp = response.data[key];
                        let action = {symbol: key, name: value, priceActual: tmp.price};
                        market.push(action);
                    }
                });
            })
            .catch(error => console.log(error))
    });
}


/* GET ALL SYMBOL */
router.get('/:symbol', function (req, res) {
    let symbol = req.params.symbol;
    let result = market.filter(action => action.symbol.startsWith(symbol.toUpperCase()));
    result = result.slice(0, 100);

    res.send(result);


});

module.exports = router;
