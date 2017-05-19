var AdminController = require('../controllers/admin.server.controller.js');

module.exports = function(router){
  router.get('/',AdminController.login);
  router.post('/',AdminController.validation);

};