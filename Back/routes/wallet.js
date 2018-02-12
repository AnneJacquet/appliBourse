var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var wallet = [];
    var act1 = {name:"twitter", symbol:"tw", priceBuy:10, priceActual:2, number:"10"};
    var act2 = {name:"instagram", symbol:"insta", priceBuy:30, priceActual:14, number:"40"};

    wallet.push(act1);
    wallet.push(act2);

    res.send(wallet);
});

module.exports = router;
