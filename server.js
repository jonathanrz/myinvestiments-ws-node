import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import connectToDatabase from "./app/database/db";
import investmentRoutes from "./app/routes/investment";
import incomeRoutes from "./app/routes/income";

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

investmentRoutes(router);
incomeRoutes(router);

app.listen(app.get("port"), () => {
  console.log("app running on port " + app.get("port"));
});
