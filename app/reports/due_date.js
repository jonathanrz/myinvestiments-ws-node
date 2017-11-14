import moment from "moment";
import Investment from "../models/investment";
import Income from "../models/income";

function fill_report(investments, res) {
  const report = [];
  investments.forEach((investment, index) => {
    if (!investment.due_date) return;
    Income.find({ investment: investment.id })
      .sort("-date")
      .limit(1)
      .exec((err, incomes) => {
        if (err) {
          res.send(err);
          return;
        }
        const report_data = {};
        report_data.name = investment.name;
        report_data.due_date = moment(investment.due_date).format("DD/MM/YYYY");
        report_data.value = "R$" + incomes[0].value.toFixed(2);
        report.push(report_data);
        if (index === investments.length - 1) res.json(report);
      });
  });
}

export default function(res) {
  Investment.find()
    .sort("due_date")
    .exec((err, investments) => {
      if (err) res.send(err);

      fill_report(investments, res);
    });
}
