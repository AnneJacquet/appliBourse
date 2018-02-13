app.service('Action', ['$http', function($http) {
    let Action = function (data) {
        this.name = data.name;
        this.symbol = data.symbol;
        this.priceBuy = data.priceBuy;
        this.number = data.number;
        this.priceActual = data.priceActual;
    };
    Action.prototype.buy = function(number) {
        console.log("buy : ");
        console.log(this);
        console.log(number);
        this.number = number;
        $http.post('http://0.0.0.0:4000/wallet', this).then(function(response) {
            console.log('ok');
        }, function(error) { console.log(error); });
    };
    Action.prototype.sell = function(number) {
        console.log("sell : ");
        console.log(this);
        console.log(number);
    };
    return Action;
}]);
