var moment = require('moment');
var Investment = require('../models/investment');
var Income = require('../models/income');

var exports = module.exports = {};

function fill_report(investments, res) {
  report = [];
  investments.forEach(function(investment, index) {
    Income.find({investment: investment.id}).sort('-date').limit(1).exec(function(err, incomes) {
        if (err) {
          res.send(err);
          return;
        }
        report_data = {};
        report_data["name"] = investment.name;
        report_data["due_date"] = moment(investment.due_date).format("DD/MM/YYYY");
        report_data["value"] = "R$" + incomes[0].value.toFixed(2);
        report.push(report_data);
        if(index == (investments.length - 1))
          res.json(report);
    });
  });
}

exports.generate_report = function(res) {
  Investment.find().sort('due_date').exec(function(err, investments) {
    if (err)
      res.send(err);

    fill_report(investments, res);
  });
}
