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
    firstname: String,
    lastname: String,
    location: String,
    ifsc: String, //IFSC (Indian Financial System Code) of the beneficiary Bank/Branch
    acctnumber: String, //Full account number of the beneficiary
	password: String,	
	email: String,
});
