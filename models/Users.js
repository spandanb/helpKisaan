var mongoose = require('mongoose');
 
/*
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
*/

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
    location: String

    //IFSC (Indian Financial System Code) of the beneficiary Bank/Branch
    //Full account number of the beneficiary
    //isReceiver: Boolean,
    //isSupporter: Boolean,
});
