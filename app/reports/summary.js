var moment = require('moment');
var Investment = require('../models/investment');
var Income = require('../models/income');

var exports = module.exports = {};

function generateDiffAndRenderData(report, res) {
  lastMonthValue = 0;
  for(month in report) {
    monthData = report[month];
    if(lastMonthValue > 0) {
      monthData["diff"] = "R$" + (monthData["value"] - lastMonthValue).toFixed(2);
    }
    lastMonthValue = monthData["value"];
    monthData["value"] = "R$" + monthData["value"].toFixed(2);
  }
  res.json(report);
}

exports.generate_report = function(res) {
  Investment.find(function(err, investments) {
    if (err)
      res.send(err);

    report = {}
    investments.forEach(function(investment, index) {
      Income.find({investment: investment.id}).exec(function(err, incomes) {
          if (err) {
            res.send(err);
            return;
          }
          incomes.forEach(function(income) {
            currentMonth = moment(income.date).format("MM/YYYY");
            monthData = report[currentMonth];
            value = 0;
            if(monthData) {
              value = monthData["value"];
            } else {
              monthData = {};
            }
            monthData["value"] = value + income.value;
            report[currentMonth] = monthData;
          });
          if(index == (investments.length - 1))
            generateDiffAndRenderData(report, res);
        });
    });
  });
}
