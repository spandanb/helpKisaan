var mongoose = require('mongoose');

var ReceiverSchema = new mongoose.Schema({
  username: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

mongoose.model('Receiver', CommentSchema);