var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    nameen: String,
    descriptionen: String,
    namehi: String,
    descriptionhi: String,
    namebn: String,
    descriptionbn: String,
    namegu: String,
    descriptiongu: String,
    namekn: String,
    descriptionkn: String,
    nameta: String,
    descriptionta: String,
    namete: String,
    descriptionte: String,
    nameur: String,
    descriptionur: String,
    
    goal: {type: Number, default: 0},
    funds: {type: Number, default: 0}, //Funds received so far    
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

mongoose.model('Project', ProjectSchema);
