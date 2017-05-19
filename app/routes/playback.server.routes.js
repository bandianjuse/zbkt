var PlaybackController = require('../controllers/playback.server.controller');

module.exports = function(app){
  app.route('/playback/:id')
      .get(PlaybackController.view);

  app.post('/playback',PlaybackController.list);

  app.get('/playback/:id/fx/:fx',PlaybackController.view);

  // app.get('/save',PlaybackController.save);

};