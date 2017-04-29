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
            value = 0;
            if(monthData) {
              console.log("monthData1=" + JSON.stringify(monthData));
              value = monthData["value"];
            } else {
              monthData = {};
            }
            monthData["value"] = value + income.value;
            console.log("monthData2=" + JSON.stringify(monthData));
            report[currentMonth] = monthData;
            console.log("report=" + JSON.stringify(report));
          });
        });
    });
    console.log("end");
    res.json(report);
  });
}
