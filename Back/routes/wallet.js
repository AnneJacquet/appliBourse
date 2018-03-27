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


const Money = mongoose.model('Money',
    {
        amount: Number,
        date: Date
    });
global.Money = Money;


//get current price of a symbol
function getPrice(symbol) {
    return new Promise(function (resolve, reject) {
        axios.get('https://api.iextrading.com/1.0/stock/' + symbol + "/price")
            .then(response => {
                resolve(response.data)
            })
            .catch(error => reject(error))
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
    //is the number of actions to buy is an integer
    if (Number.isInteger(req.body.number)) {
        Wallet.findOne({'symbol': req.body.symbol}, function (err, matchingAction) {
            //if we don't have this action yet, create one
            if (matchingAction == null) {
                getPrice(req.body.symbol).then(actualPrice => {
                    let toAdd = {
                        name: req.body.name,
                        symbol: req.body.symbol,
                        number: req.body.number,
                        priceBuy: actualPrice
                    };
                    updateMoney(-1 * toAdd.number * toAdd.priceBuy);
                    new Wallet(toAdd).save().then(() => res.status(201).end());
                });
            } else {
                //if we already have an action of this symbol, update the price and the number
                getPrice(req.body.symbol).then(actualPrice => {
                    let oldPrice = matchingAction.priceBuy;
                    let oldNumber = matchingAction.number;
                    let newNumber = req.body.number;
                    updateMoney(-1 * newNumber * actualPrice);
                    matchingAction.priceBuy = ((oldPrice * oldNumber) + (newNumber * actualPrice)) / (oldNumber + newNumber)
                    matchingAction.number += req.body.number;
                    matchingAction.save().then(res.status(201).end());
                });
            }
        });
    } else {
        res.status(412).end();
    }


});


/**
 * SELL ACTIONS FROM THE WALLET
 */
router.delete('/:symbol', function (req, res) {
    let numberToSell = req.query.number;
    let symbol = req.params.symbol;
    Wallet.findOne({'symbol': symbol}, function (err, matchingAction) {
        //if we can sell this amount of this action
        if (matchingAction != null && matchingAction.number >= numberToSell && numberToSell > 0) {
            getPrice(symbol).then(actualPrice => {

                matchingAction.number -= numberToSell;
                let diff = numberToSell * actualPrice;
                updateMoney(diff);
                //if there is no acvtion left after the sell, remove it
                if (matchingAction.number > 0) {
                    matchingAction.save().then(res.status(204).end());
                } else {
                    matchingAction.remove().then(res.status(204).end());
                }
            });
        } else {
            res.status(412).end();
        }

    });

});


/**
 * ADD A NEW ENTRY TO THE HISTORY OF WALLET
 * @param change : can be negative or positive
 */
function updateMoney(change) {
    Money.findOne({}).sort({date: -1}).exec(
        function (err, currentMoney) {
            let toAdd = {
                date: new Date()
            };
            if (currentMoney == null) {
                toAdd.amount = change;
            } else {
                toAdd.amount = change + currentMoney.amount;
            }
            new Money(toAdd).save();
        });
}


/**
 * RETURN THE ACTUAL PRICE OF ONE ACTION IN THE WALLET
 */
router.get('/:symbol', function (req, res, next) {

    getPrice(req.params.symbol)
        .then(actualPrice => res.send("" + actualPrice))
        .catch(error => console.log(error));

});


module.exports = router;
