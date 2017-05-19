var AccountController = require('../controllers/account.server.controller');

module.exports = function(router) {

  router.get('/account', AccountController.list);
  router.post('/account', AccountController.account);
  router.get('/account/:id', AccountController.user);
  router.post('/updateuser', AccountController.updateuser);
  router.post('/updateadmin', AccountController.updateadmin);
  router.post('/deladmin', AccountController.deladmin);
  router.post('/saveadmin', AccountController.saveadmin);

};