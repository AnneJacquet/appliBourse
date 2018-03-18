var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');


var db = mongoose.connect('mongodb://localhost/bourseDB');

const wallet = mongoose.model('Wallet',
    {
        name: String,
        symbol: String,
        priceBuy: Number,
        number: Number
    });


//return all actions available in the wallet
router.get('/', function (req, res, next) {

   // wallet.find({}, function (err, docs) {

  //  });

    var wallet = [];
    var act1 = {name: "twitter", symbol: "tw", priceBuy: 10, priceActual: 2, number: "10"};
    var act2 = {name: "instagram", symbol: "insta", priceBuy: 30, priceActual: 14, number: "40"};

    wallet.push(act1);
    wallet.push(act2);

    res.send(wallet);
});


/**
 * ADD ACTIONS TO WALLET
 */
router.post('/', function (req, res) {
    let toAdd = {name: req.body.name, symbol: req.body.symbol, number: req.body.number, priceBuy: req.body.priceActual};
    new wallet(toAdd).save().then(() => console.log('the action was added to the wallet'));
    res.status(201).end();
});


//sell actions from the wallet
router.delete('/:symbol', function (req, res) {
    let symbol = req.params.symbol;
    let number = req.query.number;


    console.log(req.body);
    res.status(201).end();
});


module.exports = router;
