Bare Install
============
Install git, curl

Install npm
    curl https://raw.githubusercontent.com/creationix/nvm/v0.23.0/install.sh | bash
    See: https://github.com/creationix/nvm

Install node
    Should be installed with npm
    Check if installed with: 
        nvm ls-remote

Install express

Install mongodb
    GUI-environment: Download installer: http://www.mongodb.org/downloads
    Ubuntu CL: sudo apt-get install mongodb-org


To Start App
============

To run monodb
    <<PATH TO mongod>>/mongod --dbpath <<data file>>
    e.g.
    ./bin/mongod --dbpath data

To install server side dependencies
    npm install

To start application
    npm start


Note:
=====
Server listens on port 4000.

Open Routes
===========
GET /projects - get a list of all projects and associated metadata
POST /projects - create a new project
GET /projects/:id - return an individual project 
PUT /projects/:id/support - support a project (i.e. donate funds)
POST /login - login
POST /signup - register
POST /signout - signout 

Test Routes(cURL)
================
view all projects
curl -X GET http://localhost:4000/projects/

Add a new project
curl -X POST -d"param1=value1&.." http://localhost:4000/projects

View a project
curl -X GET http://localhost:4000/projects/{{id}}

Modify a project
curl -X PUT -d "param1=value1&..." http://localhost:4000/projects/{{id}}

Delete a project
curl -X DELETE http://localhost:4000/projects/{{id}}
