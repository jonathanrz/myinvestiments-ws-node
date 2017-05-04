var moment = require('moment');
var Interest = require('../models/interest');

var exports = module.exports = {};

function validate_request(req, res) {
  body = req.body

  if(!body.name || body.name.length == 0)
    return {message: "Name not informed"}
  if(!body.date || body.date.length == 0)
    return {message: "Date not informed"}
  if(!body.holder || body.holder.length == 0)
    return {message: "Holder not informed"}
  if(!body.gross_value || body.gross_value.length == 0)
    return {message: "Gross value not informed"}
    if(!body.ir_value || body.ir_value.length == 0)
      return {message: "IR value not informed"}
}

function parse_request(interest, body) {
  interest.name = body.name;
  interest.date = moment(body.date, "DD/MM/YYYY");
  interest.holder = body.holder;
  interest.gross_value = body.gross_value;
  interest.ir_value = body.ir_value;
}

function root(router) {
  router.route('/interests')
    .get(function(req, res) {
        Interest.find(function(err, interests) {
          if (err)
            res.send(err);

          res.json(interests);
        });
      })
    .post(function(req, res) {
        var interest = new Interest();
        validation = validate_request(req, res);
        if(validation) {
          res.status(400).send(validation);
          return;
        }
        parse_request(interest, req.body);

        interest.save(function(err, saved_interest) {
          if (err)
            res.send(err);

          res.json(saved_interest);
        });
      });
}

function model(router) {
  router.route('/interests/:interest_id')
    .get(function(req, res) {
        Interest.findById(req.params.interest_id, function(err, interest) {
          if (err)
            res.send(err);
          res.json(interest);
        });
      })
    .put(function(req, res) {
        Interest.findById(req.params.interest_id, function(err, interest) {
          if (err)
            res.send(err);

          validation = validate_request(req, res);
          if(validation) {
            res.status(400).send(validation);
            return;
          }
          parse_request(interest, req.body);

          interest.save(function(err, saved_interest) {
            if (err)
              res.send(err);

            res.json(saved_interest);
          });
        });
      })
    .delete(function(req, res) {
        Interest.remove({_id: req.params.interest_id}, function(err, interest) {
          if (err)
            res.send(err);

          res.json(interest);
        });
    });
}

exports.map_routes = function(router) {
  root(router);
  model(router);
}
