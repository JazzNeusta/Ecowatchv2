const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/cors");
const routes = require("./routes");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", routes);

module.exports = app;
