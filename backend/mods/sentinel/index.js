const express = require("express");
const { createSentinel } = require("./sentinel");

const manifest = {
  name: "sentinel",
  label: "Sentinel",
  description: "Contrôle les entrées et sorties des IA et tient le journal des verdicts.",
};

function create() {
  const service = createSentinel();
  const router = express.Router();

  router.get("/journal", (req, res) => {
    const limit = Math.min(Number.parseInt(req.query.limit, 10) || 50, 500);
    res.json(service.getJournal(limit));
  });

  router.get("/stats", (req, res) => {
    res.json(service.getStats());
  });

  // Permet de tester Sentinel à la main sur un texte.
  router.post("/inspect", (req, res) => {
    const { direction = "input", text, facts } = req.body || {};
    res.json(service.inspect({ source: "manuel", direction, text, facts }));
  });

  return { service, router };
}

module.exports = { manifest, create };
