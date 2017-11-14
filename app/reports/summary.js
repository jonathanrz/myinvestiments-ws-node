import moment from "moment";
import Income from "../models/income";

function generateDiffAndRenderData(report, res) {
  let lastMonthValue = 0;
  for (const month in report) {
    const monthData = report[month];
    if (lastMonthValue > 0) {
      monthData.yield =
        "R$" + (monthData.total - lastMonthValue - monthData.bought).toFixed(2);
    }
    lastMonthValue = monthData.total;
    monthData.total = "R$" + monthData.total.toFixed(2);
    monthData.bought = "R$" + monthData.bought.toFixed(2);
  }
  res.json(report);
}

export default function(res) {
  const report = {};
  Income.find()
    .sort("date")
    .exec((err, incomes) => {
      if (err) {
        res.send(err);
        return;
      }
      incomes.forEach(income => {
        const currentMonth = moment(income.date).format("MM/YYYY");
        let monthData = report[currentMonth];
        let value = 0;
        let bought = 0;
        if (monthData) {
          value = monthData.total;
          bought = monthData.bought;
        } else {
          monthData = {};
        }
        monthData.total = value + income.value;
        monthData.bought = bought + income.boughtValue();
        report[currentMonth] = monthData;
      });
      generateDiffAndRenderData(report, res);
    });
}
