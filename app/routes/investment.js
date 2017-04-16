var Investment = require('../models/investment');

var exports = module.exports = {};

function parse_request(investment, body) {
  investment.name = body.name;
  investment.type = body.type;
  investment.holder = body.holder;
}

function root(router) {
  router.route('/investments')
    .get(function(req, res) {
        console.log("1");
        Investment.find(function(err, investments) {
          console.log("3");
          if (err)
            res.send(err);

          console.log("4");
          res.json(investments);
        });
        console.log("2");
      })
    .post(function(req, res) {
        var investment = new Investment();
        parse_request(investment, req.body);

        investment.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'Investment created!' });
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

          parse_request(investment, req.body);

          investment.save(function(err) {
            if (err)
              res.send(err);

            res.json({ message: 'Invesment updated!' });
          });
        });
      })
    .delete(function(req, res) {
        Investment.remove({_id: req.params.investment_id}, function(err, investment) {
          if (err)
            res.send(err);

          res.json({ message: 'Successfully deleted' });
        });
    });
}

exports.map_routes = function(router) {
  root(router);
  model(router);
}
