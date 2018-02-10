app.controller('MarketController',
    ['$scope', '$mdDialog', '$http', 'Market', 'Action', function ($scope, $mdDialog, $http, Market, Action) {

        $http.get('http://localhost:8082/market').then(function (response) {
            response.data._embedded.actions.forEach(function (data) {
                let newAction = new Action(data);
                Market.actions.push(newAction);
            });
            $scope.market = Market;
        }, function (error) {
            console.log(error);
        });


        //modal is open when click buy
        $scope.confirmBuy = function (action, ev) {

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'template/buyModal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen,
                locals : {
                    action : action
                }
            })
        };

        //controller the opened modal
        function DialogController($scope, $mdDialog, action) {

            $scope.choosenNumber = 1;
            $scope.numberToBuy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            $scope.actionToBuy = action;

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.buy = function (answer) {
                console.log("action to buy");
                console.log($scope.choosenNumber);
                console.log(action);
                $mdDialog.hide();
            };
        }

    }]);
