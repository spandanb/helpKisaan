var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/Users');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true, // allows us to pass back the entire request to the callback
            //Not working
            //usernameField: 'acctnumber' // changes default credential from username to acctnumber
        },
        function(req, username, password, done) {
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                //Acct Number must be unique
                User.findOne({ 'acctnumber' :  username}, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with account number: '+ accntnumber);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        //newUser.username = username ;
                        newUser.acctnumber= username; //acctnumber
                        newUser.ifsc = req.param('ifsc');
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstname = req.param('firstname');
                        newUser.lastname = req.param('lastname');
                        newUser.location = req.param('location');

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
