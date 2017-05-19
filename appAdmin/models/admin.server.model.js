var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
  name: String,
  password: String,
  createTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Admin', AdminSchema);
