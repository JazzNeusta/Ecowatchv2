const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/cors");
const routes = require("./routes");
const { ENABLED_MODS } = require("./config/env");
const { loadMods, parseModList } = require("./mods");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

const mods = loadMods(parseModList(ENABLED_MODS));
console.log(`[mods] Mods actifs : ${mods.enabled.join(", ") || "aucun"}`);

app.use("/api/mods", mods.router);
app.use("/api", routes);

module.exports = app;
