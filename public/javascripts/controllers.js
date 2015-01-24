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

    PROJ_FUNDS_RAISED : "Funds Raised",
    PROJ_GOAL : "Goal",
    PROJ_PROGRESS : "Progress",
    PROJ_MSG_IN_PROGRESS : "Percentage Raised",
    PROJ_MSG_SUCCESS : "Project Complete",

    PROJ_NAME : "Name",
    PROJ_DESCRIPTION : "Description",
    PROJ_LOCATION : "Location",

    PROJ_DONATE : "Donate",
    PROJ_APPLY_CHANGES : "Apply Changes",
    PROJ_DELETE_PROJECT : "Delete Project",
    PROJ_ADMIN_PANEL : "Admin Panel",
    PROJ_INFO : "Info",

    USER_ACCT_NUMBER : "Account Number",
    USER_IFSC : "Indian Financial System Code",
    USER_FIRST_NAME: "First Name",
    USER_LAST_NAME: "Last Name",
    USER_LOCATION: "Location",
    USER_EMAIL: "Email",
  });
  $translateProvider.translations('hi', {
    NAV_HOME: 'घर', //Ghar
    NAV_PROJECTS: 'परियोजना', //Pariyogana
    NAV_ABOUT: 'बारे में', //Barey main
    NAV_REGISTER: 'नया खाता', //Naya Khata
    NAV_SIGNIN: 'साइन इन', //Sign in
    NAV_NEW_PROJ: 'नई परियोजना', //Nai pariyogna
    NAV_LOG_OUT: "लॉग आउट", //Log out
    
    PROJ_FUNDS_RAISED : "रकम जुटाई",//rakam jootai
    PROJ_GOAL : "लक्ष्य",//lakshay
    PROJ_PROGRESS : "प्रगति", //Poorgati
    PROJ_MSG_IN_PROGRESS : "प्रगति का प्रतिशत", //Pragati ka pratishak,
    PROJ_MSG_SUCCESS : "परियोजना पूरी", //Pariyojna Poori

    PROJ_NAME : "नाम",
    PROJ_DESCRIPTION : "विवरण",//vivaran
    PROJ_LOCATION : "स्थान", //sthan
    
    PROJ_DONATE : "हाथ बढ़ाना", //Hath Badana
    PROJ_APPLY_CHANGES : "परिवर्तन लागू करें",//Parivartan Lagu Karein
    PROJ_DELETE_PROJECT : "हटाएं", //Hataye
    PROJ_ADMIN_PANEL : "व्यवस्थापक पैनल", //Vyavasthāpaka painala
    PROJ_INFO : "जानकारी", //Jaankaari
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
'$translate',
'$window',
function($scope, $rootScope, projects, project, $translate, $window){
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
        console.log("In here");
        //Check for valid input
        if (isNaN($scope.amount))
            return;
        //Check if number is > 0
        var amount = Number($scope.amount);
        if (amount <= 0)
            return;    
        projects.update(project._id, {funds: Number(project.funds + amount)});
        
        var bankUrl = function(){
            switch($scope.bank){
                case "icici":
                    return "http://www.icicibank.com/Personal-Banking/onlineservice/online-services/FundsTransfer/neft.page?";
                case "hdfc":
                    return "http://www.hdfcbank.com/personal/making-payments/fund-transfer/emonies-national-electronic-funds-transfer";
                case "union":
                    return "http://www.unionbankofindia.co.in/personal_bill_neft.aspx";
                default :
                    return ""; 
            }
        }();
        //Handle redirect
        $window.open(bankUrl, '_blank'); 
    }
    
    //variable for progress percent
    $scope.progress = Math.min(100 * $scope.project.funds / $scope.project.goal, 100).toFixed(2);
    
    //variable for progress message
    $scope.progressMsg = function(){
        if(isNaN($scope.progress)) return "";
        if($scope.progress >= 100)
            return "Project Completed!";
        else
            return String($scope.progress) + "% funded!";
    }();

    $scope.bankSelect = function(bank){
        $scope.bank = bank;
    }
    
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
'$translate',
function($scope, $http, $rootScope, $location, $resource, $translate){
    
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
   
    $scope.changelang = function (lang) {
        //console.log("Changing to lang: " + lang);
        $translate.use(lang);
        $rootScope.lang = lang;
    };
    
}])
;
