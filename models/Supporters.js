var mongoose = require('mongoose');

var SupporterSchema = new mongoose.Schema({
  username: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

mongoose.model('Supporter', CommentSchema);