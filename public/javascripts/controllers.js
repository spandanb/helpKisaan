'use strict';

angular.module('siaControllers', ['pascalprecht.translate'])
.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: "locale/locale-",
        suffix: ".json"
    });

    $translateProvider.preferredLanguage('en');
}])
.controller('MainCtrl', [
'$scope',
'projects',
'$rootScope',
'$translate',
function($scope, projects, $rootScope, $translate){
    
    $scope.projects = projects.projects;
    $scope.addProject = function(){
        projects.create({
            name:$scope.name,
            goal:$scope.goal,
            description: $scope.description, 
            owner: $rootScope.user._id,
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
'$http',
function($scope, $rootScope, projects, project, $translate, $window, $http){
    //Utility method that encodes object as URI
    var encodeParams = function(obj) {
        var url = "";
        for(var i=0, keys=Object.keys(obj); i<keys.length; i++){
            if (i > 0) {
                url += "&";
            }
            url += keys[i] + "=" + obj[keys[i]];
        }
        return url;
    }
    
    //Return url to google translate API, object 
    var createTranslateURL = function(source, target, texts){
        if (!texts || texts.length < 1) {return;}
        var base = "https://www.googleapis.com/language/translate/v2?";
        var params  = {};
        params["key"] =  "AIzaSyDjc6ZctgLju0LyWXQCH9yiEPHg2ehk_RY";
        params["source"] = source;
        params["target"] = target;
        params["callback"] = "JSON_CALLBACK"; 
        
        var url = base + encodeParams(params);
        for (var i=0; i<texts.length; i++) {
            url += "&q=" + encodeURI(texts[i]); 
        }
        return url;
    }
    
    
    
    $scope.project = project;
    
    console.log($scope.project);
    //console.log($rootScope.lang)
    
    /*
    var base = "https://www.googleapis.com/language/translate/v2?";
    var params  = {"key": "AIzaSyDjc6ZctgLju0LyWXQCH9yiEPHg2ehk_RY",
                "source": "en",
                "target": "hi",
                "callback":"JSON_CALLBACK"
    }
    params["q"] = encodeURI("Hello World");
    */
    
    
    //var url = base + encode(params)
    
    //Watch
    $rootScope.$watch(
        // This function returns the value being watched. It is called for each turn of the $digest loop
        function() { return $rootScope.lang },
        
        // This is the change listener, called when the value returned from the above function changes
        function(newLang, oldLang) {
            if (newLang !== "en") {
                translate();
            }
        }
      
    );
 
    //User should have a default lang- which would be the default lang of the project 
 
    if ($rootScope.lang !== "en") {
        translate();    
    }
    
    var translate = function(){
        //return;
        var url = createTranslateURL("en", $rootScope.lang, [$scope.project.name, $scope.project.description, $scope.project.owner.location])
        //Uses API Quota
        $http.jsonp(url)
            .success(function(res){
                var name = res.data.translations[0].translatedText;
                var description = res.data.translations[1].translatedText;
                var location = res.data.translations[2].translatedText;
                
                //console.log(name, description, location);
                //console.log($scope.project.name, $scope.project.description, $scope.project.owner.location);
                
                //Map of properties to be transliterated
                var transMap = {}; 
                
                if (name.toLowerCase() !== $scope.project.name.toLowerCase()) {
                    $scope.project.name = name;
                }else{
                    transMap["name"] = name;
                }
                
                if (description.toLowerCase() !== $scope.project.description.toLowerCase()) {
                    $scope.project.description = description;
                }else{
                    transMap["description"] = description;
                }
                
                if (location.toLowerCase() !== $scope.project.owner.location.toLowerCase()) {
                    $scope.project.owner.location = location;
                }else{
                    transMap["location"] = location;
                }
                if(Object.keys(transMap).length > 0){
                    var params = {"q": transMap, "src": "en", "dest":"hi"}
                    $http.post('/transliterate', params).success(function(res){
                        //console.log(res);
                        if(res.hasOwnProperty("name")){
                            $scope.project.name = res.name;    
                        }
                        if(res.hasOwnProperty("description")){
                            $scope.project.description = res.description;    
                        }
                        if(res.hasOwnProperty("location")){
                            $scope.project.owner.location = res.location;    
                        }
                        
                        
                        
                    }).error(function(res){})    
                }
                
                 
            }).error(function(res){
                console.log("Error: Translation API");
            });    
        
    }
    
    $scope.deleteProject = function(){
        projects.delete($scope.project._id);
    };
    
    $scope.updateValue = function(){
        var newName = document.getElementById("admin-name").innerText; //Name
        var newGoal = document.getElementById("admin-goal").innerText; //Goal
        var newDesc = document.getElementById("admin-description").innerText; //Description
        
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
'$translate',
'$state',
function($scope, $http, $rootScope, $location, $translate, $state){
    
    $scope.register = function(){
        $http.post('/signup', {
                'password': $scope.password,
                'email': $scope.email,
                'location':$scope.location,
                'ifsc': $scope.ifsc,
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
    }

    $scope.updateUser = function(){
        var properties= ["ifsc", "acctnumber", "firstname", "lastname", "location"];
        var updates = {};
        for(var i=0; i<properties.length; i++){
            var newValue = document.getElementById("user-" + properties[i]).innerText;
            var oldValue = $rootScope.user[properties[i]];
            if(oldValue !== newValue && !!newValue){
                updates[properties[i]] = newValue;
            }
        }
        if(Object.keys(updates).length !== 0){
            $http.put("/users/" + $rootScope.user._id, updates)
            .success(function(res){
                //console.log("Post Successful");
                $state.reload();
            }).error(function(res){
                //console.log("Fail");
            }); 
        }
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
   
    //Set Default Value
    $rootScope.lang = $translate.use();
    //Handle dynamic lang change
    $scope.changelang = function (lang) {
        //console.log("Changing to lang: " + lang);
        $translate.use(lang);
        $rootScope.lang = lang;
    };
    
}])
;
