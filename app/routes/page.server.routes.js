var PageController = require('../controllers/page.server.controller');

module.exports = function(app){
  app.route('/about')
      .get(PageController.about);

  app.route('/statement')
      .get(PageController.statement);

  app.route('/service')
      .get(PageController.service);

  // app.route('/pagesave')
  //     .get(PageController.save);

};