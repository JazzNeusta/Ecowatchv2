require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  ENABLED_MODS: process.env.ENABLED_MODS ?? "sentinel,biosense,jarvis",
  JARVIS_URL: process.env.JARVIS_URL || "http://localhost:8000"
};
