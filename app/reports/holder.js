var moment = require('moment');
var Investment = require('../models/investment');
var Income = require('../models/income');

var exports = module.exports = {};

exports.generate_report = function(holder, res) {
  Investment.find({holder: holder}).exec(function(err, investments) {
    if (err)
      res.send(err);
    report = {}
    investments.forEach(function(investment, index) {
      typeData = report[investment.type];
      if(!typeData) {
        typeData = {};
        report[investment.type] = typeData;
      }
      investmentData = {};
      typeData[investment.name] = investmentData;
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
          investmentData["initialValue"] =  "R$" + firstValue.toFixed(2);
          investmentData["currentValue"] =  "R$" + lastValue.toFixed(2);
          investmentData["yield"] =  "R$" + investment_yield.toFixed(2);
          investmentData["months"] = months;
          investmentData["average"] = "R$" + (investment_yield / months).toFixed(2);

          if(index == (investments.length - 1))
            res.json(report);
        });
    });
  });
}
