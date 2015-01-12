'use strict';

angular.module('kiva', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){
    $stateProvider
    //Handles landing page
    .state('home',{
        url:'/home',
        views:{
            "main":{
                templateUrl:'/home.html',
                controller:'MainCtrl',
                resolve: {
                    postPromise: ['projects', function(projects){
                        return projects.getSome(3);
                    }]
                }
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'MainCtrl',
            }
        }
    })
    //Handles all projects
    .state('projects',{
        url:'/projects', 
        views:{
            "main":{
                templateUrl:'/projects.html',
                controller:'MainCtrl',
                resolve: {
                    postPromise: ['projects', function(projects){
                        return projects.getAll();
                    }]
                }
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'MainCtrl',
            }            
        }
        
    })
    //Handles creation of new project
    .state('new_project',{
        url:'/new_project', 
        views:{
            "main":{
                templateUrl:'/new_project.html',
                controller:'MainCtrl',
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'MainCtrl',
            }            
        }
        
    })
    //Handles individual project
    .state('project', {
        url: '/projects/{id}',
        views:{
            "main":{
                templateUrl:'/project.html',
                controller:'ProjectsCtrl',
                resolve: {
                    project: ['$stateParams', 'projects', function($stateParams, projects) {
                            return projects.get($stateParams.id);
                        }]
                }
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'MainCtrl',
            }            
        }
    })
    //Handles signin
    .state('signin',{
        url:'/signin',
        views:{
            "main":{
                templateUrl:'/signin.html',
                controller: 'AuthCtrl',
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'MainCtrl',
            }            
        }
    })
    //Handles register
    .state('register',{
        url:'/register',
        views:{
            "main":{
                templateUrl:'/register.html',
                controller: 'AuthCtrl',
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'MainCtrl',
            }            
        }
    })
    //Handles profile
    .state('profile',{
        url:'/profile',
        views:{
            "main":{
                templateUrl:'/profile.html',
                controller: 'AuthCtrl',
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'MainCtrl',
            }            
        }
    })
    //Handles About Page
    .state('about',{
        url:'/about',
        views:{
            "main":{
                templateUrl:'/about.html',
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'MainCtrl',
            }            
        }
    })
    ;
    
    $urlRouterProvider.otherwise('home');
}])
.factory('auth', ['$http', '$location', function($http, $location){
    var a = {};
    
    return a;
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
    //Get count # of projects
    p.getSome = function(count) {
        return $http.get('/projects').success(function(data){
          angular.copy(data.slice(0, count), p.projects);
        });
    };
    //Posts a new project
    p.create = function(project) {
        console.log("project is: ");
        console.log(project);
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
    //console.log("In mainCtrl");
    $scope.addProject = function(){
        console.log("In add project. Name is: " + $scope.name + ". Goal is: " + $scope.goal);
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
        //console.log("foo");
        projects.update($scope.project._id, {"goal":$scope.goal});        
    }

}])
.controller('AuthCtrl',[
'$scope',
'$http',
'$rootScope',
'$location',
function($scope, $http, $rootScope, $location){
    //console.log("In the AuthCtrl");
    
    $scope.signin = function(){
        console.log("In signin function!");
        console.log("Email is "  + $scope.email + ". Password is " + $scope.password);
        //$http.post('/signup')
    }
    
    $scope.register = function(){
        console.log("In register function!");
        console.log("Email is "  + $scope.email + ". Password is " + $scope.password + " Username is " + $scope.username);
        $http.post('/signup', {
                'username': $scope.username,
                'password': $scope.password,
                'email': $scope.email
            }).success(function(user){
                console.log("Successfully registered user");
                //console.log("user is: ");
                //console.log(user);
                
                $rootScope.user = user;
                $scope.user;
                $location.path('/profile');
                
            }).error(function(res){
                console.log("Error: Unable to register user");
                console.log(res);
            });
    }
    
    $scope.signin = function(){
        $http.post('/login', {
                'username': $scope.username,
                'password': $scope.password
            }).success(function(user){
                console.log("Successfully signed in");
                //console.log("user is: ");
                //console.log(user);
                
                $rootScope.user = user;
                $scope.user;
                $location.path('/profile');
                
            }).error(function(res){
                console.log("Error: Unable to signin user");
                console.log(res);
            });
    }
    
    
}])
;
