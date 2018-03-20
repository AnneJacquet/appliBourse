var express = require('express');
var router = express.Router();
var axios = require('axios');
var mongoose = require('mongoose');


var db = mongoose.connect('mongodb://localhost/bourseDB');

const Wallet = mongoose.model('Wallet',
    {
        name: String,
        symbol: String,
        priceBuy: Number,
        number: Number
    });


//get current price of a symbol
function getPrice(symbol) {
    return new Promise(function (resolve, reject) {
        axios.get('https://api.iextrading.com/1.0/stock/' + symbol + "/price")
            .then(response => {
                resolve(response.data)
            })
    })

}


/**
 * RETURN ALL ACTION IN THE WALLET
 */
router.get('/', function (req, res, next) {

    let wallet = [];

    Wallet.find({}, function (err, actions) {

        let promises = actions.map((action) => {
            return new Promise((resolve) => {
                getPrice(action.symbol).then(actualPrice => {
                    let toShow = {
                        name: action.name,
                        symbol: action.symbol,
                        priceBuy: action.priceBuy,
                        number: action.number,
                        priceActual: actualPrice
                    };
                    wallet.push(toShow);
                    resolve();
                });
            });
        });

        Promise.all(promises).then(() => {
            res.send(wallet)
        });

    });

});


/**
 * ADD ACTIONS TO WALLET
 */
router.post('/', function (req, res) {

    Wallet.findOne({'symbol': req.body.symbol}, function (err, matchingAction) {
        //if we don't have this action yet
        if (matchingAction == null) {
            getPrice(req.body.symbol).then(actualPrice => {
                let toAdd = {
                    name: req.body.name,
                    symbol: req.body.symbol,
                    number: req.body.number,
                    priceBuy: actualPrice
                };
                new Wallet(toAdd).save().then(() => console.log('the action was added to the wallet'));
                res.status(201).end();
            });
        } else {
            getPrice(req.body.symbol).then(actualPrice => {
                let oldPrice = matchingAction.priceBuy;
                let oldNumber = matchingAction.number;
                let newNumber = req.body.number;
                matchingAction.priceBuy = ((oldPrice * oldNumber) + (newNumber * actualPrice)) / (oldNumber + newNumber)
                matchingAction.number += req.body.number;
                matchingAction.save();
                res.status(201).end();
            });
        }
    });


});


//sell actions from the wallet
router.delete('/:symbol', function (req, res) {
    let numberToSell = req.query.number;
    let symbol = req.params.symbol;
    Wallet.findOne({'symbol': symbol}, function (err, matchingAction) {
        //if we don't have this action yet
        console.log(matchingAction);
        if (matchingAction != null && matchingAction.number > numberToSell) {
            getPrice(symbol).then(actualPrice => {

                matchingAction.number -= numberToSell;
                let diff = numberToSell * (actualPrice - matchingAction.priceBuy);
                if (matchingAction.number > 0) {
                    matchingAction.save();
                } else {
                    matchingAction.remove();
                }
                res.status(204).end();
            });
        }
    });

});


module.exports = router;
