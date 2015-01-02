angular.module('kiva', [])
.factory('projects',[function(){
    var p = {
        projects:[]
   };
    return p;
}])
.controller('MainCtrl', [
'$scope', 
'projects',
function($scope, projects){
    $scope.projects = projects.projects;
//    [
//        {'name':"Buy Seeds", 'owner':'Jay Fernando', 'goal': 475, 'supporters':['Tom']},
//        {'name':"Buy Cows", 'owner':'Mai Toni', 'goal': 45, 'supporters':['Fred']},
//    ];

    $scope.addProject = function(){
        $scope.projects.push({
            'name':$scope.name,
            'owner':$scope.owner,
            'goal':$scope.goal,
        });
        $scope.owner = null;
        $scope.name = null;
        $scope.goal = null;
    }

}]);
