var moment = require('moment');
var Investment = require('../models/investment');
var Income = require('../models/income');

var exports = module.exports = {};

function generate_report(investment, res) {
  report = {}
  report["name"] = investment.name;
  report["incomes"] = {};
  Income.find({investment: investment.id}).sort('date').exec(function(err, incomes) {
      var lastValue = 0;
      incomes.forEach(function(income) {
        if(lastValue != 0) {
          month = {};
          month["value"] = income.value - lastValue;
          month["perc"] = income.value / lastValue - 1;
          report["incomes"][moment(income.date).format("MM/YYYY")] = month;
        }
        lastValue = income.value;
      });
      res.json(report);
  });
}

function root(router) {
  router.route('/reports/investments/:investment_id')
    .get(function(req, res) {
        Investment.findById(req.params.investment_id, function(err, investment) {
          if (err)
            res.send(err);

          generate_report(investment, res);
        });
      })
}

exports.map_routes = function(router) {
  root(router);
}
