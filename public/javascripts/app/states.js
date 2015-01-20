'use strict';

angular.module('sia', ['ui.router', 'ngResource', 'siaFactories', 'siaControllers'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){
    $stateProvider
    //Handles landing page
    .state('home',{
        url:'/home',
        views:{
            "main":{
                templateUrl:'/partials/home.html',
                controller:'MainCtrl',
                resolve: {
                    postPromise: ['projects', function(projects){
                        return projects.getSome(3);
                    }]
                }
            },
            "header":{
                templateUrl:'/partials/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }
        }
    })
    //Handles all projects
    .state('projects',{
        url:'/projects', 
        views:{
            "main":{
                templateUrl:'/partials/projects.html',
                controller:'MainCtrl',
                resolve: {
                    postPromise: ['projects', function(projects){
                        return projects.getAll();
                    }]
                }
            },
            "header":{
                templateUrl:'/partials/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    //Handles creation of new project
    .state('new_project',{
        url:'/new_project', 
        views:{
            "main":{
                templateUrl:'/partials/new_project.html',
                controller:'MainCtrl',
            },
            "header":{
                templateUrl:'/partials/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    //Handles individual project
    .state('project', {
        url: '/projects/{id}',
        views:{
            "main":{
                templateUrl:'/partials/project.html',
                controller:'ProjectsCtrl',
                resolve: {
                    project: ['$stateParams', 'projects', function($stateParams, projects) {
                            return projects.get($stateParams.id);
                        }]
                }
            },
            "header":{
                templateUrl:'/partials/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    //Handles signin
    .state('signin',{
        url:'/signin',
        views:{
            "main":{
                templateUrl:'/partials/signin.html',
                controller: 'AuthCtrl',
            },
            "header":{
                templateUrl:'/partials//navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    //Handles register
    .state('register',{
        url:'/register',
        views:{
            "main":{
                templateUrl:'/partials//register.html',
                controller: 'AuthCtrl',
            },
            "header":{
                templateUrl:'/partials/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    .state('signout',{
        url:'/signout',
        views:{
            "main":{
                templateUrl:'/partials/register.html',
                controller: 'AuthCtrl',
            },
            "header":{
                templateUrl:'/partials/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user_obj: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    //Handles profile
    .state('profile',{
        url:'/profile',
        views:{
            "main":{
                templateUrl:'/partials/profile.html',
                controller: 'AuthCtrl',
            },
            "header":{
                templateUrl:'/partials/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    //Handles About Page
    .state('about',{
        url:'/about',
        views:{
            "main":{
                templateUrl:'/partials/about.html',
            },
            "header":{
                templateUrl:'/partials/navbar.html',
                controller:'HeaderCtrl',
                resolve: {
                    user: ['auth', function(auth){
                        return auth.getUser();
                    }]
                },
            }            
        }
    })
    ;
    
    $urlRouterProvider.otherwise('home');
}])
;
