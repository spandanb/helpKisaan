angular.module('kiva', [])
.controller('MainCtrl', ['$scope', function($scope){
    $scope.proj_list = [
        {'name':"Buy Seeds", 'owner':'Jay Fernando', 'goal': 475, 'supporters':['Tom']},
        {'name':"Buy Cows", 'owner':'Mai Toni', 'goal': 45, 'supporters':['Fred']},
    ];

    $scope.addProject = function(){
        $scope.proj_list.push({
            'name':$scope.name,
            'owner':$scope.owner,
            'goal':$scope.goal,
        });
        $scope.owner = null;
        $scope.name = null;
        $scope.goal = null;
    }

}]);
