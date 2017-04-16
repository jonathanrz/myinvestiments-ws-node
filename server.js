var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var Investment = require('./app/models/investment');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/myinvestments-db');

var port = process.env.PORT || 8080;
var router = express.Router();

// router.use(function(req, res, next) {
//     console.log('Something is happening.');
//     next();
// });

router.get('/', function(req, res) {
  res.json({ message: 'Everything up' });
});

app.use('/api', router);

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
      investment.name = req.body.name;

      investment.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Investment created!' });
      });
    });

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

        investment.name = req.body.name;

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

app.listen(port, function() {
  console.log("app running on port " + port);
});
