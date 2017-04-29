var moment = require('moment');
var Investment = require('../models/investment');
var Income = require('../models/income');

var exports = module.exports = {};

exports.generate_report = function(res) {
  Investment.find(function(err, investments) {
    if (err)
      res.send(err);

    report = {}
    console.log("init");
    investments.forEach(function(investment) {
      console.log("investment=" + investment.name);
      Income.find({investment: investment.id}).sort('date').exec(function(err, incomes) {
          if (err) {
            res.send(err);
            return;
          }
          incomes.forEach(function(income) {
            currentMonth = moment(income.date).format("MM/YYYY");
            console.log("currentMonth=" + currentMonth);
            monthData = report[currentMonth];
            console.log("monthData1=" + monthData.toString());
            value = 0;
            if(monthData) {
              value = monthData["value"];
            } else {
              monthData = {};
            }
            monthData["value"] = value + income.value;
            console.log("monthData2=" + monthData.toString());
            report[currentMonth] = monthData;
            console.log("report=" + report.toString());
          });
        });
    });
    console.log("end");
    res.json(report);
  });
}
