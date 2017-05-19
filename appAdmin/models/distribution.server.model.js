var mongoose = require('mongoose');

var DistributionSchema = new mongoose.Schema({
  active: {type: Number, default: 1 }, //激活 0=未激活 1=激活
  userId :String,	//用户id
  opneAccount :{type: Number, default: 0 }, //开户  0=未开户， 1=已开户
  opneAccountBonus :{type: String, default: 0 },//开户提成
  trading :{type: Number, default: 0 }, //交易  0=已交易， 1=未交易
  tradingBonus:{type: String, default: 0 },//交易提成
  createTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Distribution', DistributionSchema);

