var UserController = require('../controllers/user.server.controller');

module.exports = function(app){
  app.route('/')
      .get(UserController.view)
      .post(UserController.login);

  app.route('/login')
      .get(UserController.ykLogin);

  app.route('/user')
      .get(UserController.details)
      .post(UserController.saveUser);

  app.route('/logout')
      .post(UserController.logout);

  app.route('/wealth')
      .get(UserController.wealth);

  app.route('/wealth/:id')
      .get(UserController.wealth)
};