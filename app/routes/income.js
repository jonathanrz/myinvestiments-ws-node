var moment = require('moment');
var Income = require('../models/income');

var exports = module.exports = {};

function validate_request(req, res) {
  body = req.body

  if(!body.date || body.date.length == 0)
    return {message: "Date not informed"}
  if(!body.quantity || body.quantity.length == 0)
    return {message: "Quantity not informed"}
  if(!body.value || body.value.length == 0)
    return {message: "Value not informed"}
}

function parse_request(income, investment, body) {
  income.investment = investment
  income.date = moment(body.date, "MM/YYYY");
  income.quantity = body.quantity;
  income.value = body.value;
}

function root(router) {
  router.route('/investments/:investment_id/income')
    .get(function(req, res) {
        Income.find({investment: req.params.investment_id}).sort('-date').exec(function(err, incomes) {
          if (err)
            res.send(err);

          res.json(incomes);
        });
      })
    .post(function(req, res) {
        var income = new Income();
        validation = validate_request(req, res);
        if(validation) {
          res.status(400).send(validation);
          return;
        }
        parse_request(income, req.params.investment_id, req.body);

        income.save(function(err, income) {
          if (err)
            res.send(err);

          res.json(income);
        });
      });
}

function model(router) {
  router.route('/investments/:investment_id/income/:income_id')
    .get(function(req, res) {
        Income.findById(req.params.income_id, function(err, income) {
          if (err)
            res.send(err);
          res.json(income);
        });
      })
    .put(function(req, res) {
        Income.findById(req.params.income_id, function(err, income) {
          if (err)
            res.send(err);

          validation = validate_request(req, res);
          if(validation) {
            res.status(400).send(validation);
            return;
          }
          parse_request(income, req.params.investment_id, req.body);

          income.save(function(err, income) {
            if (err)
              res.send(err);

            res.json(income);
          });
        });
      })
    .delete(function(req, res) {
        Income.remove({_id: req.params.income_id}, function(err, income) {
          if (err)
            res.send(err);

          res.json(income);
        });
    });
}

exports.map_routes = function(router) {
  root(router);
  model(router);
}
