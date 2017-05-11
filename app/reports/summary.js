var moment = require('moment');
var Investment = require('../models/investment');
var Income = require('../models/income');

var exports = module.exports = {};

function generateDiffAndRenderData(report, res) {
  lastMonthValue = 0;
  for(month in report) {
    monthData = report[month];
    if(lastMonthValue > 0) {
      monthData["yield"] = "R$" + (monthData["total"] - lastMonthValue - monthData["bought"]).toFixed(2);
    }
    lastMonthValue = monthData["total"];
    monthData["total"] = "R$" + monthData["total"].toFixed(2);
    monthData["bought"] = "R$" + monthData["bought"].toFixed(2);
  }
  res.json(report);
}

exports.generate_report = function(res) {
  report = {}
  Income.find().sort('date').exec(function(err, incomes) {
    if (err) {
      res.send(err);
      return;
    }
    incomes.forEach(function(income) {
      currentMonth = moment(income.date).format("MM/YYYY");
      monthData = report[currentMonth];
      value = 0;
      bought = 0;
      if(monthData) {
        value = monthData["total"];
        bought = monthData["bought"];
      } else {
        monthData = {};
      }
      monthData["total"] = value + income.value;
      monthData["bought"] = bought + income.boughtValue();
      report[currentMonth] = monthData;
    });
    generateDiffAndRenderData(report, res);
  });
}
