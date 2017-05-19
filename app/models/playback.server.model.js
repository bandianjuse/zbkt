var mongoose = require('mongoose');

var PlaybackSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  url: {type: String, default: 'video/LG_G5.mp4'},
  introduce: String,
  createTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Playback', PlaybackSchema);


