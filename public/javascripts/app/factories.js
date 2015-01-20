'use strict';

angular.module('siaFactories', [])
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
;
