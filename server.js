var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var cors = require("cors");
var database = require("./app/database/db");
var investment = require("./app/routes/investment");
var income = require("./app/routes/income");
var fee = require("./app/routes/fee");
var interest = require("./app/routes/interest");
var reports = require("./app/routes/reports");

var app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set("port", process.env.PORT || 8080);
var router = express.Router();

router.use(function(req, res, next) {
  console.log("headers=" + req.headers);
  console.log("auth-token=" + req.headers["auth-token"]);
  if (req.headers["auth-token"] !== process.env["MYINVESTMENTS_AUTH_TOKEN"]) {
    res.status(401).send({ message: "Invalid auth token" });
    return;
  }
  next();
});

router.get("/", function(req, res) {
  res.json({ message: "Everything up" });
});

app.use("/api", router);

investment.map_routes(router);
income.map_routes(router);
fee.map_routes(router);
interest.map_routes(router);
reports.map_routes(router);

app.listen(app.get("port"), function() {
  console.log("app running on port " + app.get("port"));
});
