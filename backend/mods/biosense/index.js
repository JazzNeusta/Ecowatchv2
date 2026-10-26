const express = require("express");
const { recommend, plants } = require("./recommend");

const manifest = {
  name: "biosense",
  label: "BioSense",
  description: "Recommandations pour les plantes à partir de l'humidex et des mesures des capteurs.",
};

function toNumber(value) {
  if (value === undefined || value === null || value === "") return undefined;
  return Number(value);
}

function create(context) {
  const router = express.Router();

  router.get("/plants", (req, res) => {
    res.json(plants.map(({ id, label }) => ({ id, label })));
  });

  router.post("/recommendations", (req, res) => {
    const body = req.body || {};
    const measures = {
      temperature: toNumber(body.temperature),
      humidity: toNumber(body.humidity),
      soilMoisture: toNumber(body.soilMoisture),
    };

    let result;
    try {
      result = recommend({ plant: body.plant, ...measures });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Sentinel vérifie que les conseils citent bien les mesures reçues.
    const text = result.recommendations.map((item) => item.message).join("\n");
    const sentinel = context.guard().inspect({
      source: "biosense",
      direction: "output",
      text,
      facts: { ...measures, humidex: result.humidex, references: result.thresholds },
    });

    if (sentinel.verdict === "block") {
      return res.status(403).json({ error: "Réponse bloquée par Sentinel", sentinel });
    }
    res.json({ ...result, sentinel });
  });

  return { router };
}

module.exports = { manifest, create };
