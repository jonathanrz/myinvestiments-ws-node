import moment from "moment";
import Investment from "../models/investment";
import Income from "../models/income";

function fill_report(investment, res) {
  const report = {};
  report.name = investment.name;
  report.incomes = {};
  Income.find({ investment: investment.id })
    .sort("date")
    .exec((err, incomes) => {
      if (err) {
        res.send(err);
        return;
      }
      let firstValue = 0;
      let lastValue = 0;
      let firstMonth;
      let lastMonth;
      incomes.forEach(income => {
        if (firstValue === 0) {
          firstValue = income.value;
          firstMonth = income.date;
        }
        if (lastValue !== 0) {
          const month = {};
          month.value = "R$" + income.value.toFixed(2);
          month.yield = "R$" + income.yield(lastValue).toFixed(2);
          month.perc = ((income.value / lastValue - 1) * 100).toFixed(2) + "%";
          report.incomes[moment(income.date).format("MM/YYYY")] = month;
        }
        lastValue = income.value;
        lastMonth = income.date;
      });
      const investment_yield = lastValue - firstValue;
      const months = moment(lastMonth).diff(moment(firstMonth), "months", true);
      const summary = {};
      summary.initialValue = "R$" + firstValue.toFixed(2);
      summary.currentValue = "R$" + lastValue.toFixed(2);
      summary.yield = "R$" + investment_yield.toFixed(2);
      summary.months = months;
      summary.average = "R$" + (investment_yield / months).toFixed(2);
      report.summary = summary;
      res.json(report);
    });
}

export default function(investment_id, res) {
  Investment.findById(investment_id, (err, investment) => {
    if (err) res.send(err);

    fill_report(investment, res);
  });
}
