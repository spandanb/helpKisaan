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
'$rootScope',
function($http, $location, $state, $rootScope){
    var p = {
        projects:[], //[project]
        projectsMap:{} //{id->proj}
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
        //console.log("project is: ");
        //console.log(project);
        return $http.post('/projects', project).success(function(data){
            p.projects.push(data); //Remove
            p.projectsMap[data._id] = data;
            //console.log(p.projects);
            //console.log(p.projectsMap);
        });
    };
    //Get a single project
    p.get = function(id){
        return $http.get('/projects/' + id).then(function(res){
            p.projectsMap[id] = res.data;
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
    
    /************************************************
     ***************translations ********************
     *************************************************/
    //Utility method that encodes object as URI
    p.encodeParams = function(obj) {
        var url = "";
        for(var i=0, keys=Object.keys(obj); i<keys.length; i++){
            if (i > 0) {
                url += "&";
            }
            url += keys[i] + "=" + obj[keys[i]];
        }
        return url;
    }
    
    //Utility method that creates url to google translate API
    p.createTranslateURL = function(source, target, texts){
        if (!texts || texts.length < 1) {return;}
        var base = "https://www.googleapis.com/language/translate/v2?";
        var params  = {};
        params["key"] =  "AIzaSyDjc6ZctgLju0LyWXQCH9yiEPHg2ehk_RY";
        params["source"] = source;
        params["target"] = target;
        params["callback"] = "JSON_CALLBACK"; 
        
        var url = base + p.encodeParams(params);
        for (var i=0; i<texts.length; i++) {
            url += "&q=" + encodeURI(texts[i]); 
        }
        return url;
    }
    
    p.getTranslation = function(project, srclang, destlang){
        console.log("In getTranslate");
        
        //don't know why this happens
        if (!project || !srclang || !destlang || srclang === destlang) {
            console.log("Error: Invalid parameters");
            console.log(project);
            console.log(srclang, destlang);
            return;
        }
        
        console.log(srclang, destlang);
        //console.log(project);
        //console.log(t.translations);
        //return;
        
        var nameS = "name" + srclang; //src lang name property
        var descS = "description" + srclang //src lang desc property
        var nameD = "name" + destlang; //dest lang name property
        var descD = "description" + destlang //dest lang desc property
    
        //Check if this translation exists
        //if (!!p.projectsMap[project._id][nameD]) { //causes error
        if (!!project[nameD]) {
            project.name = project["name" + destlang];
            project.description = project["description" + destlang];
            console.log("Returning cached translation");
            return;
        }
        
        console.log("Creating new translation");
        var url = p.createTranslateURL(srclang, destlang,
                                     [project[nameS], project[descS]]);
        
        console.log("Translate API Blocked");
        return;
       
        //Uses API Quota
        $http.jsonp(url)
            .success(function(res){                
                //Map of properties to be transliterated
                var transMap = {};         
                //map of successfully translated properties        
                var proj = {};

                if (res.error) {
                    console.log("Error: " + res.error.code + " (" + res.error.message + ")");
                    transMap[nameD] = project[nameS],
                    transMap[descD] = project[descS];
                }else{
                    var transName = res.data.translations[0].translatedText; //translated name
                    var transDesc = res.data.translations[1].translatedText; //translated desription
    
                    if (transName.toLowerCase() !== project[nameS].toLowerCase()) {
                        proj[nameD] = transName;
                    }else{
                        transMap[nameD] = project[nameS];
                    }
                    
                    if (transDesc.toLowerCase() !== project[descS].toLowerCase()) {
                        proj[descD] = transDesc;
                    }else{
                        transMap[descD] = project[descS];
                    }
                }

                //transliterate
                if(Object.keys(transMap).length > 0 && srclang === "en"){
                    var params = {"q": transMap, "src": srclang, "dest":destlang}
                    $http.post('/transliterate', params).success(function(res){
                        if(res.hasOwnProperty(nameD)){
                            proj[nameD] = res[nameD];
                         }
                        if(res.hasOwnProperty(descD)){
                            proj[descD] = res[descD];    
                        }
                        
                        if (Object.keys(proj).length > 0) {
                            //Update DB
                            p.update(project._id, proj);                           
                            //Update projectsMap
                            p.projectsMap[project._id][nameD] = proj[nameD];
                            p.projectsMap[project._id][descD] = proj[descD];
                            
                            project.name = proj[nameD];
                            project.description = proj[descD];
                        }
                        console.log(proj);
                        console.log(p.projectsMap);

                    }).error(function(res){
                        console.log("Transliterate API- fail");
                    })    
                }else{ //Nothing to transliterate
                        if (Object.keys(proj).length > 0) {
                            //Update DB
                            p.update(project._id, proj);                    
                            //Update projectsMap
                            p.projectsMap[project._id][nameD] = proj[nameD];
                            p.projectsMap[project._id][descD] = proj[descD];  
                            
                            project.name = proj[nameD];
                            project.description = proj[descD];
                        }
                        console.log(proj);
                        console.log(p.projectsMap);
                }
            }).error(function(res){
                console.log("Error: Translation API");
            });       
    }
    
    
    return p;
}])
;
