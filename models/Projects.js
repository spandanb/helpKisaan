var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: String,
    goal: {type: Number, default: 0},
    funds: {type: Number, default: 0}, //Funds received so far
    description: String, 
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

//ProjectSchema.methods.update

mongoose.model('Project', ProjectSchema);