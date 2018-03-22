app.service('ActionMarket', ['$http', function ($http) {
    let ActionMarket = function (data) {
        this.name = data.name;
        this.symbol = data.symbol;
        this.number = data.number;
        this.priceActual = data.priceActual;
        this.begin = data.begin;
    };

    return ActionMarket;
}]);
