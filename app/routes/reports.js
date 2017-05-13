var investments = require('../reports/investments');
var summary = require('../reports/summary');
var holder = require('../reports/holder');
var due_date = require('../reports/due_date');

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
  router.route('/reports/holder/:holder')
    .get(function(req, res) {
      holder.generate_report(req.params.holder, res);
    });
  router.route('/reports/due_date')
    .get(function(req, res) {
      due_date.generate_report(res);
    });
}

exports.map_routes = function(router) {
  root(router);
}
