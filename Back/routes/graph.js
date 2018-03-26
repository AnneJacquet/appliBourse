var express = require('express');
var router = express.Router();
var axios = require('axios');


/**
 * RETURN HISTORY OF MONEY
 */
router.get('/history', function (req, res) {
    Money.find({}).sort({date: -1}).select('date amount -_id')
        .exec()
        .then(history => {
            res.send(history)
        })
        .catch(error => console.log(error));
});


/**
 * RETURN GRAPH FOR ONE SYMBOL
 */
router.get('/:symbol/:time', function (req, res) {

    axios.get('https://api.iextrading.com/1.0/stock/' + req.params.symbol + '/chart/' + req.params.time)
        .then(response => {
            let results = [];


            let promises = response.data.map((entry) => {
                return new Promise((resolve) => {
                    if (entry.average != 0) {
                        if (req.params.time == '1d') {
                            year = entry.date.slice(0, 4);
                            month = entry.date.slice(4, 6);
                            day = entry.date.slice(6, 8);
                            date = year + "-" + month + "-" + day + " " + entry.minute;
                            results.push([date, entry.average]);
                        } else {
                            results.push([entry.date, entry.close]);
                        }
                    }
                    resolve();
                });
            });

            Promise.all(promises)
                .then(() => res.send(results))
                .catch(error => console.log(error));
        })

});


module.exports = router;
