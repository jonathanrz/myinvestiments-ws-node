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
    .post(function(req, res) {
        var investment = new Investment();
        investment.name = req.body.name;

        investment.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Investment created!' });
        });
    });

app.listen(port, function() {
  console.log("app running on port " + port);
});
