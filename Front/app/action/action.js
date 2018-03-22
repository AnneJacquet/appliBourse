app.service('Action', ['$http', function ($http) {
    let Action = function (data) {
        this.name = data.name;
        this.symbol = data.symbol;
        this.priceBuy = data.priceBuy;
        this.number = data.number;
        this.priceActual = data.priceActual;
    };
    Action.prototype.sell = function (number) {
        console.log("sell : ", this, " - ", number);
        $http.delete('http://0.0.0.0:4000/wallet/' + this.symbol + "?number=" + number).then(function (response) {
            console.log('I sold ' + number + " " + this.symbol);
        }, function (error) {
            console.log(error);
        });
    };
    return Action;
}]);
