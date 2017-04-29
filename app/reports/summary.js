var moment = require('moment');
var Investment = require('../models/investment');

var exports = module.exports = {};

exports.generate_report = function(res) {
  Investment.find(function(err, investments) {
    if (err)
      res.send(err);

    report = {}
    investments.forEach(function(investment) {
      Income.find({investment: investment.id}).sort('date').exec(function(err, incomes) {
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
        });
    });
    res.json(report);
  });
}
