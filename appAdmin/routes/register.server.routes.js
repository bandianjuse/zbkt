var RegisterController = require('../controllers/register.server.controller.js');

module.exports = function(router,app) {

  app.route('/register')
      .get(RegisterController.view)
      .post(RegisterController.register);

};