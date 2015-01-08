angular.module('kiva', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('home',{
        url:'/home', 
        templateUrl:'/home.html',
        controller:'MainCtrl',
        resolve: {
            postPromise: ['projects', function(projects){
                return projects.getAll();
            }]
        }
    })
    .state('projects', {
        url: '/projects/{id}',
        templateUrl: '/projects.html',
        controller: 'ProjectsCtrl',
        resolve: {
            project: ['$stateParams', 'projects', function($stateParams, projects) {
                    return projects.get($stateParams.id);
                }]
        }
    })
    
    $urlRouterProvider.otherwise('home');
}])
.factory('projects',['$http', '$location', function($http, $location){
    var p = {
        projects:[]
    };
    
    //Gets all projects    
    p.getAll = function() {
        return $http.get('/projects').success(function(data){
          angular.copy(data, p.projects);
        });
    };
    //Posts a new project
    p.create = function(project) {
        return $http.post('/projects', project).success(function(data){
            p.projects.push(data);
        });
    };
    //Get a single project
    p.get = function(id){
        return $http.get('/projects/' + id).then(function(res){
            return res.data;
        });
    };
    //Update a project
    p.update = function(id, changes){
        return $http.post('/projects/' + id, changes)            
            .success(function(res){
                console.log("Success: updated project with id: " + id );                
            })
            .error(function(res){
                console.log("Error: Unable to update project with id: " + id);
            });        
    }
    //delete a project
    p.delete = function(id){
        return $http.delete('/projects/' + id)            
            .success(function(res){
                console.log("Success: deleted project with id: " + id );
                //Redirect to home page
                $location.path('/home');
            })
            .error(function(res){
                console.log("Error: Unable to delete project with id: " + id);
            });
            
    }
    return p;
}])
.controller('MainCtrl', [
'$scope',
'$rootScope',
'projects',
function($scope, $rootScope, projects, users){
    $scope.projects = projects.projects;

    $scope.addProject = function(){
        projects.create({
            name:$scope.name,
            goal:$scope.goal    
        });
        $scope.owner = null;
        $scope.name = null;
        $scope.goal = null;
    }

}])
.controller('ProjectsCtrl', [
'$scope',
'projects',
'project',

function($scope, projects, project){
    $scope.project = project;
    
    $scope.deleteProject = function(){
        projects.delete($scope.project._id);
    };
    
    $scope.clicked = function(id){

        if (!id) {return;}
        //Static tag to be changed
        var stat = document.getElementById(id);
        if (!stat) {return;}
        //New tag
        var form = document.createElement("form");
        form.setAttribute("ng-submit", "updateValue()");
        
        var inp = document.createElement("input");
        inp["type"] = "text";
        inp["value"] = stat.innerHTML;
        inp["ng-model"] = "goal";
        form.appendChild(inp);
        
        var btn = document.createElement("button");
        btn["type"] = "submit";
        btn.innerHTML = "Enter";
        form.appendChild(btn);
        
        //Insert new element
        stat.parentNode.insertBefore(form, stat);
        //Remove old element
        stat.parentNode.removeChild(stat);
    };
    
    $scope.updateValue = function(){
        console.log("foo");
        projects.update($scope.project._id, {"goal":$scope.goal});        
    }

}]);
