var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Supporter = mongoose.model('Supporter');
var Receiver = mongoose.model('Receiver');
var Project = mongoose.model('Project');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/projects', function(req, res, next) {
  Project.find(function(err, projects){
    if(err){ return next(err); }

    res.json(projects);
  });
});

router.post('/projects', function(req, res, next) {
  var project = new Project(req.body);

  project.save(function(err, project){
    if(err){ return next(err); }

    res.json(project);
  });
});


module.exports = router;
