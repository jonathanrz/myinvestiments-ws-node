var express    = require('express');
var bodyParser = require('body-parser');
var investment = require('./app/routes/investment')

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
  res.json({ message: 'Everything up' });
});

app.use('/api', router);

investment.map_routes(router);

app.listen(port, function() {
  console.log("app running on port " + port);
});
