var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: String,
    goal: {type: Number, default: 0},
    receivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    supporters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

//ProjectSchema.methods.update

mongoose.model('Project', ProjectSchema);