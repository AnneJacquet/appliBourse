app.controller('WalletController', ['$scope', '$http', 'Wallet', 'Action', function ($scope, $http, Wallet, Action) {
    let mock = [];
    let action1 = new Action({name: 'toto', symbol: 'euro', priceBuy: '10', number: '5', priceActual: '11'});
    let action2 = new Action({name: 'titi', symbol: 'dollar', priceBuy: '5', number: '5', priceActual: '11'});
    mock.push(action1, action2);

    mock.forEach(function (data) {
        let newAction = new Action(data);
        Wallet.actions.push(newAction);
    });

    $scope.wallet = Wallet;

    $scope.details = function(newAction) {
        console.log("i want details");
        console.log(newAction);
        $scope.action = newAction;
    };

    $scope.sell = function(newAction) {
        newAction.sell();
    }

}]);
