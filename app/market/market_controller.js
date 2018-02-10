app.controller('MarketController',
        ['$scope', '$http', 'Market', 'Action', function ($scope, $http, Market, Action) {

    $http.get('http://localhost:8082/market').then(function (response) {
        response.data._embedded.actions.forEach(function (data) {
            let newAction = new Action(data);
            Market.actions.push(newAction);
        });
        $scope.market = Market;
    }, function (error) {
        console.log(error);
    });


    $scope.buy = function (action) {
        console.log($scope.lol);
        action.buy($scope.lol);
    };

    $scope.confirmBuy = function (action) {
        $scope.choosenNumber = 1;
        $scope.numberToBuy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    };





}]);

