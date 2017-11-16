import moment from "moment";
import Investment from "../models/investment";
import Income from "../models/income";

function validate_request(req) {
  const body = req.body;

  if (!body.name || body.name.length === 0)
    return { message: "Name not informed" };
  if (!body.type || body.type.length === 0)
    return { message: "Type not informed" };
  if (!body.holder || body.holder.length === 0)
    return { message: "Holder not informed" };
}

function parse_request(investment, body) {
  investment.name = body.name;
  investment.type = body.type;
  investment.holder = body.holder;
  if (body.due_date) investment.due_date = moment(body.due_date, "DD/MM/YYYY");
}

function root(router) {
  router
    .route("/investments")
    .get((req, res) => {
      Investment.find()
        .exec((err, investments) => {
          if (err) res.send(err);

          const queriesPromises = [];

          console.log(`with_incomes=${req.query.with_incomes}`);
          console.log(`query=${req.query}`);
          console.log(`params=${req.params}`);
          if (req.query.with_incomes) {
            console.log(`inside if`);
            investments = investments.map(investment => {
              investment.a = "a";
              console.log(`investment=${investment.name}`);
              const queryPromise = Income.find({
                investment: investment._id
              }).exec();
              queriesPromises.push(queryPromise);
              queryPromise.then(incomes => {
                investment.incomes = incomes;
                console.log(
                  `investment=${investment.name} incomes=${investment.incomes
                    .length}`
                );
              });
              return investment;
            });
            console.log(`end of if`);
          }

          console.log(`promises=${queriesPromises.length}`);
          Promise.all(queriesPromises).then(() => {
            console.log(`incomes=${investments[0].incomes.length}`);
            res.json(investments);
          });
          return false;
        })
        .catch(err => {
          res.send(err);
        });
    })
    .post((req, res) => {
      const investment = new Investment();
      const validation = validate_request(req, res);
      if (validation) {
        res.status(400).send(validation);
        return;
      }
      parse_request(investment, req.body);

      investment.save((err, investment) => {
        if (err) res.send(err);

        res.json(investment);
      });
    });
}

function model(router) {
  router
    .route("/investments/:investment_id")
    .get((req, res) => {
      Investment.findById(req.params.investment_id, (err, investment) => {
        if (err) res.send(err);
        investment.a = "a";
        res.json(investment);
      });
    })
    .put((req, res) => {
      Investment.findById(req.params.investment_id, (err, investment) => {
        if (err) res.send(err);

        const validation = validate_request(req, res);
        if (validation) {
          res.status(400).send(validation);
          return;
        }
        parse_request(investment, req.body);

        investment.save((err, investment) => {
          if (err) res.send(err);

          res.json(investment);
        });
      });
    })
    .delete((req, res) => {
      Investment.remove(
        { _id: req.params.investment_id },
        (err, investment) => {
          if (err) res.send(err);

          res.json(investment);
        }
      );
    });
}

const map_routes = router => {
  root(router);
  model(router);
};

export default map_routes;
