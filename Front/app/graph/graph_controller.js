app.controller('GraphController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    $scope.$on('refreshGraph', function (event) {
        $scope.drawMoney();
    });

    $scope.drawMoney = function () {
        angular.element(document).ready(function () {

            $http.get('http://0.0.0.0:4000/wallet/history').then(function (response) {
                $scope.content = response.data.map(el => [new Date(el.date), el.amount]);
                $scope.symbolEvol = null;
                drawGraph();

            }, function (error) {
                console.log(error);
            });
        });
    };

    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback($scope.drawMoney());


    $scope.onRangeChange = function (range) {
        $http.get('https://api.iextrading.com/1.0/stock/' + $scope.symbolEvol + '/chart/' + range).then(function (response) {
            if (range == '1d') {
                initSymbolEvol();
            } else {
                $scope.content = [];
                response.data.forEach(entry => {
                    if (entry.close != 0) {
                        $scope.content.push([new Date(entry.date), entry.close]);
                        drawGraph();
                    }
                });
            }
        })
    };

    //to view the evolution of the given symbol
    $scope.$on('viewGraph', function (event, symbol) {
        $scope.symbolEvol = symbol;
        initSymbolEvol();
    });


    function initSymbolEvol() {
        $http.get('https://api.iextrading.com/1.0/stock/' + $scope.symbolEvol + '/chart/1d').then(function (response) {
            $scope.content = [];
            response.data.forEach(entry => {
                if (entry.average != 0) {
                    year = entry.date.slice(0, 4);
                    month = entry.date.slice(4, 6);
                    day = entry.date.slice(6, 8);
                    date = year + "-" + month + "-" + day + " " + entry.minute;
                    $scope.content.push([new Date(date), entry.average]);
                    drawGraph();
                }
            });
        }, function (error) {
            console.log(error);
        });
    }

    function drawGraph() {
        let data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Wallet');
        data.addRows($scope.content);

        let options = {
            hAxis: {
                title: 'Time',
                format: 'M/d/yy \nHH:mm',
                gridlines: {count: 15}

            },
            vAxis: {
                title: 'Amount'
            },
            colors: ['#1ABC9C'],
        };

        let chart = new google.visualization.LineChart(document.getElementById('graph'));
        chart.draw(data, options);
    }

}]);