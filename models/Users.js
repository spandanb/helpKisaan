var mongoose = require('mongoose');
 
var UserSchema = new mongoose.Schema({
    id: String,
    email: String,
    username:String,
    password: String,     
    firstname: String,
    lastname: String,
    isReceiver: Boolean,
    isSupporter: Boolean,
    location: String
}); 
 
mongoose.model('User', UserSchema); 
 