app.controller('GraphController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    $scope.$on('refreshGraph', function (event) {
        $scope.drawMoney();
    });

    $scope.timeEvol = 'jour';

    $scope.drawMoney = function () {
        angular.element(document).ready(function () {

            $http.get('http://0.0.0.0:4000/graph/history').then(function (response) {
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
        $http.get('http://0.0.0.0:4000/graph/' + $scope.symbolEvol + '/' + range).then(function (response) {
            $scope.content = response.data.map(entry => [new Date(entry[0]), entry[1]]);
            drawGraph();
        })
    };

    //to view the evolution of the given symbol
    $scope.$on('viewGraph', function (event, symbol) {
        $scope.symbolEvol = symbol;
        $scope.onRangeChange('1d');
    });


    function drawGraph() {
        let data = new google.visualization.DataTable();
        data.addColumn('datetime', 'Date');
        data.addColumn('number', 'Wallet');
        data.addRows($scope.content);

        let options = {
            chartArea: {
                height: '70%',
                top: 10
            },
            hAxis: {
                title: 'Time',
                format: 'M/d/yy \nHH:mm'
            },
            vAxis: {
                title: 'Amount'
            },
            colors: ['#1ABC9C'],
            legend: {position: 'top', maxLines: 2}
        };

        let chart = new google.visualization.LineChart(document.getElementById('graph'));
        chart.draw(data, options);
    }

}]);