app.service('Action', [function() {
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
    };
    Action.prototype.sell = function(number) {
        console.log("sell : ");
        console.log(this);
        console.log(number);
    };
    return Action;
}]);
