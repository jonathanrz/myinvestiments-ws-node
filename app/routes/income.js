import moment from "moment";
import Income from "../models/income";

function validate_request(req) {
  const body = req.body;

  if (!body.date || body.date.length === 0)
    return { message: "Date not informed" };
  if (!body.quantity || body.quantity.length === 0)
    return { message: "Quantity not informed" };
  if (!body.value || body.value.length === 0)
    return { message: "Value not informed" };
}

function parse_request(income, investment, body) {
  income.investment = investment;
  income.date = moment(body.date, "MM/YYYY");
  income.quantity = body.quantity;
  income.value = body.value;
  income.bought = body.bought || 0;
  income.sold = body.sold || 0;
  income.gross = body.gross || 0;
  income.ir = body.ir || 0;
  income.fee = body.fee || 0;
}

function root(router) {
  router
    .route("/investments/:investment_id/income")
    .get((req, res) => {
      Income.find({ investment: req.params.investment_id })
        .sort("-date")
        .exec((err, incomes) => {
          if (err) res.send(err);

          res.json(incomes);
        });
    })
    .post((req, res) => {
      const income = new Income();
      const validation = validate_request(req, res);
      if (validation) {
        res.status(400).send(validation);
        return;
      }
      parse_request(income, req.params.investment_id, req.body);

      income.save((err, income) => {
        if (err) res.send(err);

        res.json(income);
      });
    });
}

function model(router) {
  router
    .route("/investments/:investment_id/income/:income_id")
    .get((req, res) => {
      Income.findById(req.params.income_id, (err, income) => {
        if (err) res.send(err);
        res.json(income);
      });
    })
    .put((req, res) => {
      Income.findById(req.params.income_id, (err, income) => {
        if (err) res.send(err);

        const validation = validate_request(req, res);
        if (validation) {
          res.status(400).send(validation);
          return;
        }
        parse_request(income, req.params.investment_id, req.body);

        income.save((err, income) => {
          if (err) res.send(err);

          res.json(income);
        });
      });
    })
    .delete((req, res) => {
      Income.remove({ _id: req.params.income_id }, (err, income) => {
        if (err) res.send(err);

        res.json(income);
      });
    });
}

const map_routes = router => {
  root(router);
  model(router);
};

export default map_routes;
