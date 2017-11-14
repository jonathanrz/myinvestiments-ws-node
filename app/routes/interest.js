import moment from "moment";
import Interest from "../models/interest";

function validate_request(req) {
  const body = req.body;

  if (!body.name || body.name.length === 0)
    return { message: "Name not informed" };
  if (!body.date || body.date.length === 0)
    return { message: "Date not informed" };
  if (!body.holder || body.holder.length === 0)
    return { message: "Holder not informed" };
  if (!body.gross_value || body.gross_value.length === 0)
    return { message: "Gross value not informed" };
  if (!body.ir_value || body.ir_value.length === 0)
    return { message: "IR value not informed" };
}

function parse_request(interest, body) {
  interest.name = body.name;
  interest.date = moment(body.date, "DD/MM/YYYY");
  interest.holder = body.holder;
  interest.gross_value = body.gross_value;
  interest.ir_value = body.ir_value;
}

function root(router) {
  router
    .route("/interests")
    .get((req, res) => {
      Interest.find((err, interests) => {
        if (err) res.send(err);

        return res.json(interests);
      });
    })
    .post((req, res) => {
      const interest = new Interest();
      const validation = validate_request(req, res);
      if (validation) {
        res.status(400).send(validation);
        return;
      }
      parse_request(interest, req.body);

      interest.save((err, saved_interest) => {
        if (err) res.send(err);

        res.json(saved_interest);
      });
    });
}

function model(router) {
  router
    .route("/interests/:interest_id")
    .get((req, res) => {
      Interest.findById(req.params.interest_id, (err, interest) => {
        if (err) res.send(err);
        res.json(interest);
      });
    })
    .put((req, res) => {
      Interest.findById(req.params.interest_id, (err, interest) => {
        if (err) res.send(err);

        const validation = validate_request(req, res);
        if (validation) {
          res.status(400).send(validation);
          return;
        }
        parse_request(interest, req.body);

        interest.save((err, saved_interest) => {
          if (err) res.send(err);

          res.json(saved_interest);
        });
      });
    })
    .delete((req, res) => {
      Interest.remove({ _id: req.params.interest_id }, (err, interest) => {
        if (err) res.send(err);

        res.json(interest);
      });
    });
}

export default function(router) {
  root(router);
  model(router);
}
