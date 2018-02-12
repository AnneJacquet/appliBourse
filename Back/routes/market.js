var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var market = [];
    var act1 = {name:"goole", symbol:"goo", priceBuy:15, priceActual:10, number:"1"};
    var act2 = {name:"facebook", symbol:"fb", priceBuy:20, priceActual:3, number:"1"};

    market.push(act1);
    market.push(act2);

    res.send(market);
});

module.exports = router;
