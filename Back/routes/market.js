var express = require('express');
var router = express.Router();
var axios = require('axios');


prepare();


function prepare() {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
    //get all symbols
        .then(response => getAllSymbol(response))
        //split by chunks of 100
        .then(market => chunkArray(market, 100))
        .then(splitArray => )
        .catch(error => {
            console.log(error);
        });
}


function getAllSymbol(response) {
    let market = [];
    response.data.forEach(function (data) {
        let action = {name: data.name, symbol: data.symbol};
        market.push(action);
    });
    console.log("number of symbols " + market.length);
    return market;
}

function chunkArray(myArray, chunk_size) {
    let results = [];

    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size))
    }

    console.log("number of chunks " + results.length);

    return results;
}


/* GET ALL SYMBOL */
router.get('/:symbol', function (req, res) {
    let symbol = req.params.symbol;
    let result = market.filter(action => action.symbol.startsWith(symbol.toUpperCase()));
    result = result.slice(0, 100);


    axios.all([
        result.forEach(function (data) {
            axios.get('https://api.iextrading.com/1.0/stock/' + data.symbol + '/price')
                .then(price => {
                    data.priceActual = price.data;
                    // data.priceActual = price.data;
                    let pk = price.data;
                    console.log(pk);
                    //console.log("this is th eprice !! ");
                    //console.log(price);
                })
                .catch(error => {
                    console.log(error);
                });
        })
    ])
        .then(axios.spread(() => {
            console.log("all dine");
            console.log(result.length);
            res.send(result);
        }));


    /*    request('https://api.iextrading.com/1.0/ref-data/symbols', function (error, response, body) {
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

        });*/

    // axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
    //     .then(response => {
    //         console.log(response.data.length);
    //         response.data.forEach(function (data) {
    //             let action = {name: data.name, symbol: data.symbol};
    //             // console.log(action);
    //             market.push(action);
    //
    //         });
    //         res.send(market);
    //     })
    //     // .then(() => {
    //     //     market.forEach(function (data) {
    //     //         axios.get('https://api.iextrading.com/1.0/stock/ALL-A/price')
    //     //             .then(price => {
    //     //                // data.priceActual = price.data;
    //     //                 let pk = price.data;
    //     //                 //console.log("this is th eprice !! ");
    //     //                 //console.log(price);
    //     //             })
    //     //             .catch(error => {
    //     //                 console.log(error);
    //     //             });
    //     //     })
    //     // })
    //     .catch(error => {
    //         console.log(error);
    //     });


});

module.exports = router;
