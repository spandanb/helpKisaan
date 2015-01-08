var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');

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
router.post('/projects', function(req, res, next) {
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

module.exports = router;
