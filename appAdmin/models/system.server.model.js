var mongoose = require('mongoose');

var SystemSchema = new mongoose.Schema({
  item: String, //配置项
  value :Object,	//配置内容
  createTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('System', SystemSchema);

