angular.module('kiva', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('home',{
        url:'/home', 
        templateUrl:'/home.html',
        controller:'MainCtrl'
    })
    .state('projects',{
        url: '/projects/{id}',
        templateUrl:'/projects.html',
        controller: 'ProjectCtrl',
    });

    $urlRouterProvider.otherwise('home');
}])
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
            name:$scope.name,
            owner:$scope.owner,
            goal:$scope.goal,
            supporters:[
                {userName:'bobr'},
                {userName:'freddy'},
            ]
        });
        $scope.owner = null;
        $scope.name = null;
        $scope.goal = null;
    }

}])
.controller('ProjectCtrl',[
'$scope',
'$stateParams',
'projects',
function($scope, $stateParams, projects){
   $scope.project = projects.projects[$stateParams.id];
}]);
