Bare Install
============
Install git, curl

Install nvm
    curl https://raw.githubusercontent.com/creationix/nvm/v0.23.0/install.sh | bash
    See: https://github.com/creationix/nvm
    May need to: source ~/.nvm/nvm.sh 

Install npm
    sudo apt-get -y install nodejs nodejs-dev npm
    May need to: sudo apt-get update
    
Install node
    Should be installed with npm
    Check if installed with: 
        nvm ls-remote

To Setup MongoDB
================
Install mongodb
    GUI-environment: Download installer: http://www.mongodb.org/downloads
    Ubuntu CL: 

        apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
        echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list
        apt-get -y update
        apt-get -y install mongodb-10gen

        -This runs mongodb as daemon
        
        See: http://tecadmin.net/install-mongodb-on-ubuntu/
            https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-12-04

        Runs as service:
            sudo service mongodb start
            sudo service mongodb service
            sudo service mongodb stop
        

To run monodb as foreground process:
    <<PATH TO mongod>>/mongod --dbpath <<data file>>
    e.g.
    ./bin/mongod --dbpath data


To Start App
============
Clone Repo:
    git clone https://superspandan@bitbucket.org/superspandan/sia.git

To install server side dependencies
    npm install

To start application
    npm start


Note
====
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
=================
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

Troubleshooting
===============
To check version of node
    node -v
    
To change version of node
    nvm install <version>       Download and install a <version>
    nvm install v0.10.13
    
    nvm use <version>           Modify PATH to use <version>
    nvm ls                      List versions (installed versions are blue)

To upgrade node:    
    sudo npm cache clean -f
    sudo npm install -g n
    sudo n stable