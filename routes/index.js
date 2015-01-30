'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}


// check if the user is logged in
var requireAuth = function(req, res, next){

  if(!req.isAuthenticated()){
    req.session.messages = "You need to login to view this page";
    res.status(404).send('Page Not Found.');
  }else{
    next();
  }
}

//Check if logged in user is project owner
//var isOwner = function(req, res, next){
var canModify = function(req, res, next){

  //Check if user is owner 
  var isOwner = function(user, project){
     return String(user._id) !== String(project.owner);
  }
  
  if(!req.isAuthenticated()){
    req.session.messages = "You need to login to view this page";
    res.status(404).send('Page Not Found.');
  }else if(!isOwner(req.user, req.project) && !isAdmin(req.user)){
    req.session.messages = "Unauthorized request";
    res.status(404).send('Page Not Found.');
  }
  else{
    next();
  }
}

//Check if user is admin
var isAdmin = function(user){
  return user.acctnumber === "12345";
}

module.exports = function(passport, googleTransliterate){
    
    //For debugging, matches all routes, outputs
    //  verb, route, and params 
    router.all('*', function(req, res, next){
        //Output string
        var output = req.method + " " + req.url;
        if (!!req.body && Object.keys(req.body).length) { //Contains passed in params
            output += ", " + JSON.stringify(req.body);
        }
        console.log(output);
        next();
    });
    
    /* GET home page. */
    router.get('/', function(req, res) {
      res.render('index', { title: 'Express' });
    });
    
    /*Get all projects*/
    router.get('/projects', function(req, res, next) {
        
        Project.find().populate('owner').exec(function(err, projects){
            if(err){ return next(err); }
            res.json(projects);
        });
    });
    
    
    /*Create a project*/
    router.post('/projects', requireAuth, function(req, res, next) {
      var project = new Project(req.body);  
      project.save(function(err, project){
        if(err){ return next(err); }    
        res.json(project);
      });
    });
    
    /*Preload a project*/
    router.param('project', function(req, res, next, id) {
      var query = Project.findById(id);
      query.populate('owner')
            .exec(function (err, project){
        if (err) { return next(err); }
        if (!project) { return next(new Error("can't find project")); }
    
        req.project = project;
        return next();
      });
    });
    
    /*Get a single project*/
    router.get('/projects/:project', function(req, res, next) {
        var project = req.project.toJSON(); 
        res.json(project);
    });
    
    
    /*Update a project*/
    //FIX: Put can't be a protected route since any translation triggers an update
    router.put('/projects/:project', function(req, res, next){    
        //Updates the properties
        for(var property in req.body){
            req.project[property] = req.body[property]     
        }
        //Save the document
        req.project.save(function(err, project){
            if(err){ return next(err); }
    
            res.json(project);
        });
    });
    
    /*Delete a project*/
    router.delete('/projects/:project', canModify, function(req, res, next) {    
      //Delete project
      req.project.remove();
      //Send response
      res.send("Deleted project with id: " + req.project._id);
    });
   

    /***********************************************
     *******************USER************************
     ***********************************************/

    /*Preload a user*/
    router.param('user', function(req, res, next, id) {
      var query = User.findById(id);
      query.exec(function (err, user){
        if (err) { return next(err); }
        if (!user) { return next(new Error("can't find user")); }
    
        req.user = user;
        return next();
      });
    });

    /*Update a user*/
    router.put('/users/:user', function(req, res, next) {
        //Updates the properties
        for(var property in req.body){
            req.user[property] = req.body[property]     
        }
        //Save the document
        req.user.save(function(err, user){
            if(err){ return next(err); }
            res.json(user);
        });
    });
    /***********************************************
     *****************PASSPORT**********************
     ***********************************************/
           
    //Register
    router.post('/signup', passport.authenticate('signup'), function(req,res){
            res.send(req.user); 
        } 
    );
    
    //Checks if logged in
    //TODO: what if user intercepts incoming responses and modifies them
    router.get('/loggedin', function(req, res) {
        if(req.isAuthenticated()){
          var user = req.user.toJSON();
          user.isAdmin = isAdmin(user); 
          res.send(user);
        }else{
          res.send('0');
        }
    }); 
    
    //Login
    router.post('/login', passport.authenticate('login'), function(req, res) {
        console.log("In POST /login");
        res.send(req.user);
    }); 
        
    //Logout 
    router.get('/signout', function(req, res) {
            req.logout();
            res.redirect('/');
    });
    
    
    router.post('/transliterate', function(req, res){
        var src = req.body.src;
        var dest = req.body.dest;
        //var texts = req.body.q;        
        //Takes a property-value map, e.g. {"location":"Toronto"}
	//	and returns an array of the values
	var texts = function(obj){            
            var keys = Object.keys(req.body.q);
            var values = [];
            for(var i=0; i<keys.length; i++){
                values.push(obj[keys[i]]);
            }
            return values;
        }(req.body.q);
                
        var keys = Object.keys(req.body.q);
        
	
        googleTransliterate.transliterate(texts, src, dest, function(err, transliteration){
            console.log(transliteration);
            var response = {};
	    if (!transliteration) {
		res.send(500).end();
		return;
	    }
		
	    for(var i=0; i<transliteration.length; i++){
                response[keys[i]] = transliteration[i]["hws"][0];
            }
            //res.json(transliteration);
            console.log(response);
            //response is a map of key->transliteration
	    res.json(response);
        });
        //console.log("foo");
        //res.send(200);
    });
    
    //Direction Matrix API
    router.get('/directions', function(req, res){
        var https = require('https');
        var options = {
            host: "maps.googleapis.com",
            path: "/maps/api/distancematrix/json?origins=Toronto+Cananda&destinations=Brampton+Canada&key=AIzaSyDjc6ZctgLju0LyWXQCH9yiEPHg2ehk_RY"
            }; 
        
        //Modified from http://stackoverflow.com/questions/9577611
        var request = https.get(options, function(response) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            
            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
              // You can process streamed parts here...
              bodyChunks.push(chunk);
            }).on('end', function() {
              var body = Buffer.concat(bodyChunks);
              //console.log('BODY: ' + body);
              // ...and/or process the entire body here.
              res.send(body);
            })
        });
    });
        
    return router;
}
