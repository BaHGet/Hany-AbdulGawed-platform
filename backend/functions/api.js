require('dotenv').config()
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
mongoose.connect(
  `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@hany-server.px9xs90.mongodb.net/account`
);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

const route = express.Router();
route.get("/", (req, res) => {
  res.json({
    hello: "hi!",
  });
});

mongoose.pluralize(null);

const lessonsRouter = require("../routes/lessons");
const accountsRouter = require("../routes/accounts");
const AlgebraRouter = require("../routes/algebra");
const CalculusRouter = require("../routes/calculus");
const StaticsRouter = require("../routes/statics");
const DynamicsRouter = require("../routes/dynamics");
const SpatialGeomatryRouter = require("../routes/SpatialGeomatry");
const HandelOldAccounts = require("../routes/handelOldAccounts");
const IssueReport = require("../routes/issuesReport");
app.use("/.netlify/functions/api/lessons", lessonsRouter);
app.use("/.netlify/functions/api/accounts", accountsRouter);
app.use("/.netlify/functions/api/Algebra", AlgebraRouter);
app.use("/.netlify/functions/api/Calculus", CalculusRouter);
app.use("/.netlify/functions/api/Statics", StaticsRouter);
app.use("/.netlify/functions/api/Dynamics", DynamicsRouter);
app.use("/.netlify/functions/api/SpatialGeomatry", SpatialGeomatryRouter);
app.use("/.netlify/functions/api/handelOldAccounts", HandelOldAccounts);
app.use("/.netlify/functions/api/issues", IssueReport);

module.exports.handler = serverless(app);
