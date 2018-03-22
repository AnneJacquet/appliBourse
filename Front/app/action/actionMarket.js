app.service('ActionMarket', ['$http', function ($http) {
    let ActionMarket = function (data) {
        this.name = data.name;
        this.symbol = data.symbol;
        this.number = data.number;
        this.priceActual = data.priceActual;
        this.yesterday = data.yesterday;
        this.lastMonth = data.lastMonth;
    };

    return ActionMarket;
}]);
