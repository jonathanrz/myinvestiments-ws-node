var investments = require('../reports/investments');
var summary = require('../reports/summary');

var exports = module.exports = {};

function root(router) {
  router.route('/reports/investments/:investment_id')
    .get(function(req, res) {
      investments.generate_report(req.params.investment_id, res);
    });
  router.route('/reports/summary')
    .get(function(req, res) {
      summary.generate_report(res);
    });
}

exports.map_routes = function(router) {
  root(router);
}
