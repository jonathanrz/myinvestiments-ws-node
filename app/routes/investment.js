var moment = require('moment');
var Investment = require('../models/investment');

var exports = module.exports = {};

function validate_request(req, res) {
  body = req.body

  if(!body.name || body.name.length == 0)
    return {message: "Name not informed"}
  if(!body.type || body.type.length == 0)
    return {message: "Type not informed"}
  if(!body.holder || body.holder.length == 0)
    return {message: "Holder not informed"}
}

function parse_request(investment, body) {
  investment.name = body.name;
  investment.type = body.type;
  investment.holder = body.holder;
  if(body.due_date)
    investment.due_date = moment(body.due_date, "DD/MM/YYYY");
}

function root(router) {
  router.route('/investments')
    .get(function(req, res) {
        Investment.find(function(err, investments) {
          if (err)
            res.send(err);

          res.json(investments);
        });
      })
    .post(function(req, res) {
        var investment = new Investment();
        validation = validate_request(req, res);
        if(validation) {
          res.status(400).send(validation);
          return;
        }
        parse_request(investment, req.body);

        investment.save(function(err, investment) {
          if (err)
            res.send(err);

          res.json(investment);
        });
      });
}

function model(router) {
  router.route('/investments/:investment_id')
    .get(function(req, res) {
        Investment.findById(req.params.investment_id, function(err, investment) {
          if (err)
            res.send(err);
          res.json(investment);
        });
      })
    .put(function(req, res) {
        Investment.findById(req.params.investment_id, function(err, investment) {
          if (err)
            res.send(err);

          validation = validate_request(req, res);
          if(validation) {
            res.status(400).send(validation);
            return;
          }
          parse_request(investment, req.body);

          investment.save(function(err, investment) {
            if (err)
              res.send(err);

            res.json(investment);
          });
        });
      })
    .delete(function(req, res) {
        Investment.remove({_id: req.params.investment_id}, function(err, investment) {
          if (err)
            res.send(err);

          res.json(investment);
        });
    });
}

exports.map_routes = function(router) {
  root(router);
  model(router);
}
