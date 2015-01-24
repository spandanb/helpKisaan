var mongoose = require('mongoose');
 
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
