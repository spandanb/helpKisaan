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


module.exports = function(passport){
    
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
      Project.find(function(err, projects){
        if(err){ return next(err); }
    
        res.json(projects);
      });
    });
    
    
    /*Create a project*/
    router.post('/projects', isAuthenticated, function(req, res, next) {
      console.log("req.body is:");
      console.log(req.body);
      var project = new Project(req.body);
    
      project.save(function(err, project){
        if(err){ return next(err); }
    
        res.json(project);
      });
    });
    
    /*Preload a project*/
    router.param('project', function(req, res, next, id) {
      var query = Project.findById(id);
      query.exec(function (err, project){
        if (err) { return next(err); }
        if (!project) { return next(new Error("can't find project")); }
    
        req.project = project;
        //var owners = [];
        //console.log("req.project.owners.length is XXXXXXXXXXXXXXXXXXXXXXXX"); 
        //console.log(req.project.owners.length)
        //console.log(req.project.owners);
        //for(var i=0; i<req.project.owners.length; i++){
        //    console.log("SASS");
        //    console.log(req.project.owners[i]);
        //    console.log(User.findById(req.project.owners[i]));
        //}
        //console.log(req.project.owners);
        //console.log("FFFFFFFFFFFFFFOOOOOOOO");
        return next();
      });
    });
    
    /*Get a single project*/
    router.get('/projects/:project', function(req, res) {
      res.json(req.project);
    });
    
    
    /*Update a project*/
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
    router.delete('/projects/:project', function(req, res, next) {    
      //Delete project
      req.project.remove();
      //Send response
      res.send("Deleted project with id: " + req.project._id);
    });
    
    /***********************************************
     *****************PASSPORT**********************
     ***********************************************/
    
    // GET login page.
    //Unused
    router.get('/login', function(req, res) {
    // Display the Login page with any flash message, if any
            res.render('login', { message: req.flash('message') });
    });
   
    // Handle Login POST 
    /*router.post('/signin', passport.authenticate('login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash : true  
    }));
    */
    // GET Registration Page 
    //Unused
    /*
    router.get('/signup', function(req, res){
            res.render('register',{message: req.flash('message')});
    });
    */
    
    // Handle Registration POST 
    /*
    router.post('/signup', passport.authenticate('signup', {
            successRedirect: '/profile',
            failureRedirect: '/signup',
            failureFlash : true  
        })           
    );
    */
    
    //Register
    router.post('/signup', passport.authenticate('signup'), function(req,res){
            //console.log("req.user is: ");
            //console.log(req.user);
            res.send(req.user); 
        } 
    );
    
    //Checks if logged in
    //TODO: what if user intercepts incoming responses and modifies them
    router.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }); 
    
    //Login
    router.post('/login', passport.authenticate('login'), function(req, res) {
        console.log("In POST /login");
        res.send(req.user);
    }); 
    
    // GET Profile Page
    //Unused
    router.get('/profile', isAuthenticated, function(req, res){
            res.render('profile', { user: req.user });
    });
    
    // Handle Logout 
    router.get('/signout', function(req, res) {
            req.logout();
            res.redirect('/');
    });
    
    return router;
}


//module.exports = router;
