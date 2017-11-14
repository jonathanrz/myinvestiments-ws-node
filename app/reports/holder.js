import moment from "moment";
import Investment from "../models/investment";
import Income from "../models/income";
import Fee from "../models/fee";
import Interest from "../models/interest";

function add_interests_and_render_report(holder, report, res) {
  Interest.find({ holder })
    .sort("date")
    .exec((err, interests) => {
      const interestsReport = [];
      interests.forEach(interest => {
        interestsReport.push({
          name: interest.name,
          date: moment(interest.date).format("DD/MM/YYYY"),
          value: "R$" + interest.net_value().toFixed(2)
        });
      });
      report.interests = interestsReport;
      res.json(report);
    });
}

function add_fees_and_render_report(holder, report, res) {
  Fee.find({ holder })
    .sort("date")
    .exec((err, fees) => {
      const feesReport = [];
      fees.forEach(fee => {
        feesReport.push({
          name: fee.name,
          date: moment(fee.date).format("DD/MM/YYYY"),
          value: "R$" + fee.value.toFixed(2)
        });
      });
      report.fees = feesReport;
      add_interests_and_render_report(holder, report, res);
    });
}

export default function(holder, res) {
  Investment.find({ holder }).exec((err, investments) => {
    if (err) res.send(err);
    const investmentsReport = {};
    investments.forEach((investment, index) => {
      Income.find({ investment: investment.id })
        .sort("date")
        .exec((err, incomes) => {
          if (err) {
            res.send(err);
            return;
          }
          const firstMonth = incomes[0].date;
          const firstValue = incomes[0].value;
          const lastMonth = incomes[incomes.length - 1].date;
          const lastValue = incomes[incomes.length - 1].value;
          const investment_yield = lastValue - firstValue;
          const months = moment(lastMonth).diff(
            moment(firstMonth),
            "months",
            true
          );
          const investmentData = {};
          investmentData.name = investment.name;
          investmentData.initialValue = "R$" + firstValue.toFixed(2);
          investmentData.currentValue = "R$" + lastValue.toFixed(2);
          investmentData.yield = "R$" + investment_yield.toFixed(2);
          investmentData.months = months;
          investmentData.average =
            "R$" + (investment_yield / months).toFixed(2);
          if (!investmentsReport[investment.type])
            investmentsReport[investment.type] = [];
          investmentsReport[investment.type].push(investmentData);

          if (index === investments.length - 1) {
            const report = {};
            report.investments = investmentsReport;
            add_fees_and_render_report(holder, report, res);
          }
        });
    });
  });
}
