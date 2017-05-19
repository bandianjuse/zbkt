var DistributionController = require('../controllers/distribution.server.controller.js');

module.exports = function(router) {

  router.get('/distribution', DistributionController.list);
  router.post('/distribution', DistributionController.search);
  router.get('/review/:id', DistributionController.reviewList);
  router.post('/review', DistributionController.reviewSubmit);

};