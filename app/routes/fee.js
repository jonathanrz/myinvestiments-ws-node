var moment = require('moment');
var Fee = require('../models/fee');

var exports = module.exports = {};

function validate_request(req, res) {
  body = req.body

  if(!body.name || body.name.length == 0)
    return {message: "Name not informed"}
  if(!body.date || body.date.length == 0)
    return {message: "Date not informed"}
  if(!body.holder || body.holder.length == 0)
    return {message: "Holder not informed"}
}

function parse_request(fee, body) {
  fee.name = body.name;
  fee.date = moment(body.date, "DD/MM/YYYY");
  fee.holder = body.holder;
}

function root(router) {
  router.route('/fees')
    .get(function(req, res) {
        Fee.find(function(err, fees) {
          if (err)
            res.send(err);

          res.json(fees);
        });
      })
    .post(function(req, res) {
        var fee = new Fee();
        validation = validate_request(req, res);
        if(validation) {
          res.status(400).send(validation);
          return;
        }
        parse_request(fee, req.body);

        fee.save(function(err, saved_fee) {
          if (err)
            res.send(err);

          res.json(saved_fee);
        });
      });
}

function model(router) {
  router.route('/fees/:fee_id')
    .get(function(req, res) {
        Fee.findById(req.params.fee_id, function(err, fee) {
          if (err)
            res.send(err);
          res.json(fee);
        });
      })
    .put(function(req, res) {
        Fee.findById(req.params.fee_id, function(err, fee) {
          if (err)
            res.send(err);

          validation = validate_request(req, res);
          if(validation) {
            res.status(400).send(validation);
            return;
          }
          parse_request(fee, req.body);

          fee.save(function(err, saved_fee) {
            if (err)
              res.send(err);

            res.json(saved_fee);
          });
        });
      })
    .delete(function(req, res) {
        Fee.remove({_id: req.params.fee_id}, function(err, fee) {
          if (err)
            res.send(err);

          res.json(fee);
        });
    });
}

exports.map_routes = function(router) {
  root(router);
  model(router);
}
