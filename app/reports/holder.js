var moment = require('moment');
var Investment = require('../models/investment');
var Income = require('../models/income');
var Fee = require('../models/fee');

var exports = module.exports = {};

function add_fees_and_render_report(holder, report, res) {
  Investment.find({holder: holder}).sort('date').exec(function(err, fees) {
    fees = [];
    fees.forEach(function(fee) {
      fee.push({
        "name": fee.name,
        "value": "R$" + fee.value.toFixed(2)
      });
    });
    report["fees"] = fees;
    res.json(report);
  });
}

exports.generate_report = function(holder, res) {
  Investment.find({holder: holder}).exec(function(err, investments) {
    if (err)
      res.send(err);
    investmentsReport = {};
    investments.forEach(function(investment, index) {
      Income.find({investment: investment.id}).sort('date').exec(function(err, incomes) {
          if (err) {
            res.send(err);
            return;
          }
          var firstMonth = incomes[0].date;
          var firstValue = incomes[0].value;
          var lastMonth = incomes[incomes.length - 1].date;
          var lastValue = incomes[incomes.length - 1].value;
          investment_yield = (lastValue - firstValue);
          months = moment(lastMonth).diff(moment(firstMonth), 'months', true);
          investmentData = {};
          investmentData["name"] =  investment.name;
          investmentData["initialValue"] =  "R$" + firstValue.toFixed(2);
          investmentData["currentValue"] =  "R$" + lastValue.toFixed(2);
          investmentData["yield"] =  "R$" + investment_yield.toFixed(2);
          investmentData["months"] = months;
          investmentData["average"] = "R$" + (investment_yield / months).toFixed(2);
          if(!investmentsReport[investment.type])
            investmentsReport[investment.type] = [];
          investmentsReport[investment.type].push(investmentData);

          if(index == (investments.length - 1)) {
            report = {};
            report["investments"] = investmentsReport;
            add_fees_and_render_report(holder, report, res);
          }
        });
    });
  });
}
