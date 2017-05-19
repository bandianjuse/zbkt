var mongoose = require('mongoose');

var PageSchema = new mongoose.Schema({
  title: String,
  content: String,
  createTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Page', PageSchema);


