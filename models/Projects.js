var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: String,
    goal: {type: Number, default: 0},
    receivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receiver' }],
    supporters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supporter' }]
});

mongoose.model('Project', ProjectSchema);