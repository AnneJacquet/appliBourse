app.service('Action', ['$http', function ($http) {
    let Action = function (data) {
        this.name = data.name;
        this.symbol = data.symbol;
        this.priceBuy = data.priceBuy;
        this.number = data.number;
        this.priceActual = data.priceActual;
    };
    return Action;
}]);
