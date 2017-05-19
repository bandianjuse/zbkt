var mongoose = require('mongoose');

var RegisterSchema = new mongoose.Schema({
  phone: String,
  password:String,	
  createTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Register', RegisterSchema);

