app.controller('WalletController',
    ['$scope', '$mdDialog', '$http', 'Wallet', 'Action', function ($scope, $mdDialog, $http, Wallet, Action) {

        $http.get('http://localhost:8082/wallet').then(function (response) {
            response.data._embedded.wallets.forEach(function (data) {
                let newAction = new Action(data);
                Wallet.actions.push(newAction);
            });
            $scope.wallet = Wallet;
        }, function (error) {
            console.log(error);
        });


        $scope.details = function (newAction) {
            console.log("i want details");
            console.log(newAction);
            $scope.action = newAction;
        };


        //modal is open when click buy
        $scope.confirmSell = function (action, ev) {

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'template/sellModal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    action: action
                }
            })
        };

        //controller the opened modal
        function DialogController($scope, $mdDialog, action) {

            $scope.choosenNumber = 1;

            $scope.numberToBuy = [];

            for (var i = 1; i <= action.number; i++) {
                $scope.numberToBuy.push(i);
            }

            $scope.actionToSell = action;

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.sell = function () {
                action.sell($scope.choosenNumber);
                $mdDialog.hide();
            };
        }

    }]);
