import moment from "moment";
import Fee from "../models/fee";

function validate_request(req) {
  const body = req.body;

  if (!body.name || body.name.length === 0)
    return { message: "Name not informed" };
  if (!body.date || body.date.length === 0)
    return { message: "Date not informed" };
  if (!body.holder || body.holder.length === 0)
    return { message: "Holder not informed" };
  if (!body.value || body.value.length === 0)
    return { message: "Value not informed" };
}

function parse_request(fee, body) {
  fee.name = body.name;
  fee.date = moment(body.date, "DD/MM/YYYY");
  fee.holder = body.holder;
  fee.value = body.value;
}

function root(router) {
  router
    .route("/fees")
    .get((req, res) => {
      Fee.find((err, fees) => {
        if (err) res.send(err);

        return res.json(fees);
      });
    })
    .post((req, res) => {
      const fee = new Fee();
      const validation = validate_request(req, res);
      if (validation) {
        res.status(400).send(validation);
        return;
      }
      parse_request(fee, req.body);

      fee.save((err, saved_fee) => {
        if (err) res.send(err);

        res.json(saved_fee);
      });
    });
}

function model(router) {
  router
    .route("/fees/:fee_id")
    .get((req, res) => {
      Fee.findById(req.params.fee_id, (err, fee) => {
        if (err) res.send(err);
        res.json(fee);
      });
    })
    .put((req, res) => {
      Fee.findById(req.params.fee_id, (err, fee) => {
        if (err) res.send(err);

        const validation = validate_request(req, res);
        if (validation) {
          res.status(400).send(validation);
          return;
        }
        parse_request(fee, req.body);

        fee.save((err, saved_fee) => {
          if (err) res.send(err);

          res.json(saved_fee);
        });
      });
    })
    .delete((req, res) => {
      Fee.remove({ _id: req.params.fee_id }, (err, fee) => {
        if (err) res.send(err);

        res.json(fee);
      });
    });
}

const map_routes = router => {
  root(router);
  model(router);
};

export default map_routes;
