var express    = require('express')
var bodyParser = require('body-parser')
var helmet     = require('helmet')
var database   = require('./app/database/db')
var investment = require('./app/routes/investment')

var app = express();

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 8080));
var router = express.Router();

router.use(function(req, res, next) {
  if(req.headers["auth-token"] === process.env["MYINVESTMENTS_AUTH_TOKEN"])
    next();
  else
    res.status(401).send({message: "Invalid auth token"});
});

router.get('/', function(req, res) {
  res.json({ message: 'Everything up' });
});

app.use('/api', router);

investment.map_routes(router);

app.listen(app.get('port'), function() {
  console.log("app running on port " + app.get('port'));
});
