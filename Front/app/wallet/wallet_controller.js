app.controller('WalletController',
    ['$scope', '$rootScope', '$mdDialog', '$http', 'Action', function ($scope, $rootScope, $mdDialog, $http, Action) {


        display();

        function display() {
            let Wallet = {actions: []};
            $scope.wallet = Wallet;
            $http.get('http://0.0.0.0:4000/wallet').then(function (response) {
                let oldDetail = $scope.action == null ? '' : $scope.action.symbol;
                $scope.action = null;
                response.data.forEach(function (data) {
                    let newAction = new Action(data);
                    $scope.wallet.actions.push(newAction);
                    if (newAction.symbol === oldDetail) {
                        $scope.action = newAction;
                    }
                });
            }, function (error) {
                console.log(error);
            });
        }

        $scope.$on('refreshWallet', function (event) {
            display()
        });

        $scope.details = function (newAction) {
            $http.get('http://0.0.0.0:4000/wallet/' + newAction.symbol).then(function (response) {
                newAction.priceActual = parseFloat(response.data);
                $scope.action = newAction;
            });
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

            for (let i = 1; i <= action.number; i++) {
                $scope.numberToBuy.push(i);
            }

            $scope.actionToSell = action;

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.sell = function () {
                console.log("sell : ", action, " - ", $scope.choosenNumber);
                $http.delete('http://0.0.0.0:4000/wallet/' + action.symbol + "?number=" + $scope.choosenNumber)
                    .then(function (response) {
                        display(); //refresh wall ui
                        $rootScope.$broadcast('refreshGraph'); //refresh graph ui
                    }, function (error) {
                        console.log(error);
                    });
                $mdDialog.hide();
            };
        }

    }]);

