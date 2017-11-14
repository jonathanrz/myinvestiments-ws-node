import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import connectToDatabase from "./app/database/db";
import investment from "./app/routes/investment";
import income from "./app/routes/income";
import fee from "./app/routes/fee";
import interest from "./app/routes/interest";
import reports from "./app/routes/reports";

const app = express();
connectToDatabase();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set("port", process.env.PORT || 8080);
const router = express.Router();

router.use((req, res, next) => {
  if (req.headers["auth-token"] !== process.env.MYINVESTMENTS_AUTH_TOKEN) {
    res.status(401).send({ message: "Invalid auth token" });
    return;
  }
  next();
});

router.get("/", (req, res) => {
  res.json({ message: "Everything up" });
});

app.use("/api", router);

investment.map_routes(router);
income.map_routes(router);
fee.map_routes(router);
interest.map_routes(router);
reports.map_routes(router);

app.listen(app.get("port"), () => {
  console.log("app running on port " + app.get("port"));
});
