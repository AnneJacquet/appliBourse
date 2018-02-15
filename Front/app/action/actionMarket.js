app.service('ActionMarket', ['$http', function ($http) {
    let ActionMarket = function (data) {
        this.name = data.name;
        this.symbol = data.symbol;
        this.number = data.number;
        this.priceActual = data.priceActual;
        this.yesterday = data.yesterday;
        this.lastMonth = data.lastMonth;
    };
    ActionMarket.prototype.buy = function (number) {
        console.log("buy : ");
        console.log(this);
        console.log(number);
        this.number = number;
        $http.post('http://0.0.0.0:4000/wallet', this).then(function (response) {
            console.log('ok');
        }, function (error) {
            console.log(error);
        });
    };

    return ActionMarket;
}]);
