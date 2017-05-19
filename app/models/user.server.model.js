var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  openid : String,
  name: {type: String, default: randomName},
  phone: String,
  portrait: {type: String, default: '/phone/images/bar_tx.png'},
  level: {type: String, default: 0},
  type: {type: Number, default: 0}, //用户权限 0=普通用户，1=管理员，2=受权用户
  blacklist : {type: Number, default: 0},
  region : {type: String, default: '广东 深圳'},
  email : {type: String, default: null},
  introducer : {type: String, default: null},
  createTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', UserSchema);

function randomName(){
  var timestamp = ((new Date()).valueOf()).toString();
  var name = "zh_"+ timestamp.substr(6,6);
  return name;
}
