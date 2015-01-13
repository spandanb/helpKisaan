'use strict';

angular.module('sia', ['ui.router'])
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
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
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
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
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
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
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
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
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
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
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
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    .state('signout',{
        url:'/signout',
        views:{
            "main":{
                templateUrl:'/register.html',
                controller: 'AuthCtrl',
            },
            "header":{
                templateUrl:'/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user_obj: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
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
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
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
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    ;
    
    $urlRouterProvider.otherwise('home');
}])
.factory('auth', [
'$http',
'$location',
'$rootScope',
function($http, $location, $rootScope){
    var a = {
            user:null
        };
    
    a.getUser = function(){
        return $http.get('/loggedin').then(
        function(res){
            return res.data;
        });
    };    
    
    //NOTE: Does not work    
    //data is the object of login credentials,
    a.signin = function(data, success_callback, failure_callback){
        $http.post('/login', data).success(function(user){
                console.log("Successfully signed in:");
                console.log(user);
                angular.copy(a.user, user);
                if(success_callback)success_callback(user);
                
            }).error(function(res){
                console.log("Error: Unable to signin user");
                console.log(res);
                angular.copy(a.user, null);
                if(error_callback) error_callback();
            });
    };
    
    a.signout = function(){        
        $http.get('/signout').success(function(){
            console.log("Succesfully signed out!");
            $rootScope.user = null;
        });
    };
    
    a.register = function(){
    }; 
    
    return a;
}])
.factory('projects',[
'$http',
'$location',
'$state',
function($http, $location, $state){
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
        return $http.put('/projects/' + id, changes)            
            .success(function(res){
                console.log("Success: updated project with id: " + id );
                $state.reload();
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
'projects',
'$rootScope',
function($scope, projects, $rootScope){
    $scope.projects = projects.projects;
    $scope.addProject = function(){
        console.log("In add project. Name is: " + $scope.name + ". Goal is: " + $scope.goal);
        projects.create({
            name:$scope.name,
            goal:$scope.goal,
            owners: [$rootScope.user._id],            
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
    
    //Allows owners to modify goal of project
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
        //console.log("Here");
        projects.update($scope.project._id, {"goal":$scope.goal});        
    }
    
    $scope.donate = function(){
        //Check for valid input
        if (isNaN($scope.amount))
            return;
        //Check if number is > 0
        var amount = Number($scope.amount);
        if (amount <= 0)
            return;    
        projects.update(project._id, {funds: Number(project.funds + amount)}); 
    }
    

}])
.controller('AuthCtrl',[
'$scope',
'$http',
'$rootScope',
'$location',
function($scope, $http, $rootScope, $location){
    
    $scope.register = function(){
        $http.post('/signup', {
                'username': $scope.username,
                'password': $scope.password,
                'email': $scope.email
            }).success(function(res){
                console.log("Successfully registered user");
                $rootScope.user = res;
                //Redirect
                $location.path('/profile');
                
            }).error(function(res){
                console.log("Error: Unable to register user");
                console.log(res);
                $scope.error = "Error: Unable to register user";
            });
    }
    
    $scope.signin = function(){
        $http.post('/login', {
                'username': $scope.username,
                'password': $scope.password
            }).success(function(res){
                console.log("Successfully signed in");                
                $rootScope.user = res;
                $location.path('/profile');
                
            }).error(function(res){
                console.log("Error: Unable to signin user");
                console.log(res);
                $scope.error = "Error: Unable to signin user";
            });
    }
    
    $scope.signout = function(){
        $http.get('/signout').success(function(){
            console.log("Succesfully signed out!");
            $rootScope.user = null;
        });
    };
}])
.controller('HeaderCtrl', [
'$scope',    
'$rootScope',
'auth',
'user',
function($scope, $rootScope, auth, user){
    //Sets $rootScope.user if user still logged in 
    $rootScope.user = user;    
    
    $scope.signout = function(){
        auth.signout();
    };

    
    
    
}])
;
