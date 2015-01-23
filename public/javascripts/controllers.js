'use strict';

angular.module('siaControllers', ['ngResource',
                       'pascalprecht.translate'])
.config(function ($translateProvider) {
  $translateProvider.translations('en', {
    NAV_HOME: 'Home',
    NAV_PROJECTS: 'Projects',
    NAV_ABOUT: 'About',
    NAV_REGISTER: 'Register',
    NAV_SIGNIN: 'Sign In',
    NAV_NEW_PROJ: 'New Project',
    NAV_LOG_OUT: "Log Out",
  });
  $translateProvider.translations('hi', {
    NAV_HOME: 'घर', //Ghar
    NAV_PROJECTS: 'परियोजना', //Pariyogana
    NAV_ABOUT: 'बारे में', //Barey main
    NAV_REGISTER: 'नया खाता', //Naya Khata
    NAV_SIGNIN: 'साइन इन', //Sign in
    NAV_NEW_PROJ: 'नई परियोजना', //Nai pariyogna
    NAV_LOG_OUT: "लॉग आउट", //Log out
  });
  $translateProvider.preferredLanguage('en');
})
.controller('MainCtrl', [
'$scope',
'projects',
'$rootScope',
function($scope, projects, $rootScope){
    
    $scope.projects = projects.projects;
    $scope.addProject = function(){
        projects.create({
            name:$scope.name,
            goal:$scope.goal,
            description: $scope.description, 
            owner: $rootScope.user._id,
            location: $scope.location,
        });
        $scope.owner = null;
        $scope.name = null;
        $scope.goal = null;
    }

}])
.controller('ProjectsCtrl', [
'$scope',
'$rootScope',
'projects',
'project',
function($scope, $rootScope, projects, project){
    $scope.project = project;
        
    $scope.deleteProject = function(){
        projects.delete($scope.project._id);
    };
    
    $scope.updateValue = function(){
        var newName = document.getElementById("admin-name").innerText; //Name
        var newGoal = document.getElementById("admin-goal").innerText; //Goal
        var newDesc = document.getElementById("admin-description").innerText; //Description
        var newLoc = document.getElementById("admin-location").innerText; //Location
        
        var updates = {};
       
        console.log(newName);
       
        if(newName !== $scope.project.name){
            updates["name"] = newName;
        }
        if(Number(newGoal) !== $scope.project.goal){
            updates["goal"] = newGoal;
        }
        if(newDesc !== $scope.project.desc){
            updates["description"] = newDesc;
        }
        if(newLoc !== $scope.project.location){
            updates["location"] = newLoc;
        }
        if(Object.keys(updates).length !== 0)
            projects.update($scope.project._id, updates); 
    }
    
    //Method to handle donate    
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
    
    //variable for progress percent
    $scope.progress = Math.min(100 * $scope.project.funds / $scope.project.goal, 100);
    
    //variable for progress message
    $scope.progressMsg = function(){
        if(isNaN($scope.progress)) return "";
        if($scope.progress >= 100)
            return "Project Completed!";
        else
            return String($scope.progress) + "% funded!";
    }();
    
    //Checks if current user has permission to edit project
    $scope.isEditable = function(){
        //check if user is owner || admin
        return $rootScope.user._id === project.owner
                    || $rootScope.user.isAdmin;
    }

}])
.controller('AuthCtrl',[
'$scope',
'$http',
'$rootScope',
'$location',
'$resource',
function($scope, $http, $rootScope, $location, $resource){
    
    $scope.register = function(){
        $http.post('/signup', {
                'password': $scope.password,
                'email': $scope.email,
                'location':$scope.location,
                'ifsc': $scope.ifsc,
                //'acctnumber': $scope.acctnumber,
                'username': $scope.acctnumber,
                'firstname': $scope.firstname,
                'lastname': $scope.lastname,
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
                'username': $scope.acctnumber,
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
    
    $scope.getDist = function(){
        
        $http.get('/directions').success(function(data){    
            console.log(JSON.stringify(data));
            $scope.dist = JSON.stringify(data);            
        });
       
 
        /*
        
        var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Toronto+Cananda&destinations=Brampton+Canada&key=AIzaSyDjc6ZctgLju0LyWXQCH9yiEPHg2ehk_RY&callback=JSON_CALLBACK";
         
        //Trying to get direction matrix using jsonp 
        $http.jsonp(url, {"type":"application/json"})
            .success(function(response) {
           //console.log(typeof(response))
           //var foo = JSON.parse(response);
           //$scope.names = response;
           //console.log(foo);
            })
           .error(function(res){
            console.log("E");
            console.log(res);
           })
           ;
        */


            /*
            //With transformResponse function
            $http({
            url: url,
            method: "JSONP",
            //responseType: "application/javascript"
            //contentType: "application/json",
            //dataType: "jsonp",
            transformResponse: function(data, headers){
                console.log(data);
                data = {}
                data.coolThing = "foo";
                
                return data;
            }
        });
        */

        /*
        //Using $resource
        var directions = $resource(url, 
            {callback: "JSON_CALLBACK"}, 
            { get: {method:"JSONP"}});
        var foo = directions.get();
        console.log(foo);
        */
    }
}])
.controller('HeaderCtrl', [
'$scope',    
'$rootScope',
'auth',
'user',
'$translate',
function($scope, $rootScope, auth, user, $translate){
    //Sets $rootScope.user if user still logged in 
    $rootScope.user = user;    
    
    $scope.signout = function(){
        auth.signout();
    };
    
    
    //$translate.use("hi");
    $scope.changeLanguage = function (lang) {
        $translate.use(lang);
        $rootScope.lang = lang;   
    };
    
    //Translate entire header bar
    $translate(['NAV_HOME',
        'NAV_PROJECTS',
        'NAV_ABOUT',
        'NAV_REGISTER',
        'NAV_SIGNIN',
        'NAV_NEW_PROJ',
        'NAV_LOG_OUT']).then(function (translation) {
        $scope.home = translation['NAV_HOME'];
        $scope.projects = translation['NAV_PROJECTS'],
        $scope.about = translation['NAV_ABOUT'],
        $scope.register = translation['NAV_REGISTER'],
        $scope.signin = translation['NAV_SIGNIN'],
        $scope.new_proj = translation['NAV_NEW_PROJ'],
        $scope.log_out = translation['NAV_LOG_OUT']
    });
    
}])
;
