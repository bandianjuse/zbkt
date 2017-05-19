var LiveController = require('../controllers/live.server.controller');

module.exports = function(app){
  app.route('/live')
      .get(LiveController.view)
      .post(LiveController.blacklist);
  
  app.get('/live/:id',LiveController.view);

  app.route('/consulting')
      .get(LiveController.consulting);

  app.get('/consulting/:id',LiveController.consulting);
};