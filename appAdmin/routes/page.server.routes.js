var PageController = require('../controllers/page.server.controller.js');

module.exports = function(router) {

  router.get('/page', PageController.page);
  router.post('/page', PageController.update);

};