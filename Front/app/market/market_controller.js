app.controller('MarketController',
    ['$scope', '$mdDialog', '$http', 'Market', 'Action', function ($scope, $mdDialog, $http, Market, Action) {

        $http.get('http://0.0.0.0:4000/market').then(function (response) {
            response.data.forEach(function (data) {
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

            $scope.buy = function () {
                action.buy($scope.choosenNumber);
                $mdDialog.hide();
            };
        }

    }]);
