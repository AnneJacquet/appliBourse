app.controller('WalletController',
    ['$scope', '$mdDialog', '$http', 'Wallet', 'Action', function ($scope, $mdDialog, $http, Wallet, Action) {
        let mock = [];
        let action1 = new Action({name: 'toto', symbol: 'euro', priceBuy: '10', number: '5', priceActual: '11'});
        let action2 = new Action({name: 'titi', symbol: 'dollar', priceBuy: '5', number: '5', priceActual: '11'});
        mock.push(action1, action2);

        mock.forEach(function (data) {
            let newAction = new Action(data);
            Wallet.actions.push(newAction);
        });

        $scope.wallet = Wallet;

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
