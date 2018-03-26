app.controller('MarketController',
    ['$scope', '$rootScope', '$mdDialog', '$http', '$timeout', 'Action',
        function ($scope, $rootScope, $mdDialog, $http, $timeout, Action) {

            let inputChangedPromise;

            $scope.show = function (symbol) {
                if (inputChangedPromise) {
                    $timeout.cancel(inputChangedPromise);
                }
                inputChangedPromise = $timeout(() => getMarket(symbol), 300);
            };


            $scope.viewGraph = function (symbol) {
                $rootScope.$broadcast('viewGraph', symbol);
            };


            function getMarket(symbol) {
                let Market = {actions: []};
                if (symbol) {
                    $http.get('http://0.0.0.0:4000/market/' + symbol).then(function (response) {
                        response.data.forEach(function (data) {
                            let newAction = new Action(data);
                            Market.actions.push(newAction);
                        });
                        $scope.market = Market;
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    $scope.market = Market;
                }
            }


            //modal is open when click buy
            $scope.confirmBuy = function (action, ev) {

                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'template/buyModal.html',
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
                $scope.actionToBuy = action;

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.buy = function () {
                    if (Number.isInteger($scope.choosenNumber)) {
                        console.log("buy : ", action, " - ", $scope.choosenNumber);
                        action.number = $scope.choosenNumber;
                        //close the modal
                        $mdDialog.hide();
                        //add the action to the wallet
                        $http.post('http://0.0.0.0:4000/wallet', action).then(function (response) {
                            //refresh the walled ui
                            $rootScope.$broadcast('refreshWallet');
                            $rootScope.$broadcast('refreshGraph');
                        }, function (error) {
                            console.log(error);
                        });
                    }
                };
            }

        }]);
