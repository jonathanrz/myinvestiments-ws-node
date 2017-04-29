var moment = require('moment');
var Investment = require('../models/investment');
var Income = require('../models/income');

var exports = module.exports = {};

function fill_report(investment, res) {
  report = {}
  report["name"] = investment.name;
  report["incomes"] = {};
  Income.find({investment: investment.id}).sort('date').exec(function(err, incomes) {
      if (err) {
        res.send(err);
        return;
      }
      var firstValue = 0;
      var lastValue = 0;
      var firstMonth;
      var lastMonth;
      incomes.forEach(function(income) {
        if(firstValue == 0) {
          firstValue = income.value;
          firstMonth = income.date;
        }
        if(lastValue != 0) {
          month = {};
          month["value"] = "R$" + income.value.toFixed(2);
          month["yield"] = "R$" + (income.yield(lastValue)).toFixed(2);
          month["perc"] = ((income.value / lastValue - 1) * 100).toFixed(2) + "%";
          report["incomes"][moment(income.date).format("MM/YYYY")] = month;
        }
        lastValue = income.value;
        lastMonth = income.date;
      });
      investment_yield = (lastValue - firstValue);
      months = moment(lastMonth).diff(moment(firstMonth), 'months', true);
      summary = {};
      summary["initialValue"] =  "R$" + firstValue.toFixed(2);
      summary["currentValue"] =  "R$" + lastValue.toFixed(2);
      summary["yield"] =  "R$" + investment_yield.toFixed(2);
      summary["months"] = months;
      summary["average"] = "R$" + (investment_yield / months).toFixed(2);
      report["summary"] = summary;
      res.json(report);
  });
}

exports.generate_report = function(investment_id, res) {
  Investment.findById(investment_id, function(err, investment) {
    if (err)
      res.send(err);

    fill_report(investment, res);
  });
}
