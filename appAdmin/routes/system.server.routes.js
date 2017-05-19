var SystemController = require('../controllers/system.server.controller.js');

module.exports = function(router) {

  router.get('/system', SystemController.system);
  router.post('/system', SystemController.update);

};