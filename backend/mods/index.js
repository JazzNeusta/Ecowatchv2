const express = require("express");

// Mods connus. L'ordre compte : Sentinel est chargé en premier car les
// autres mods lui soumettent leurs entrées et sorties.
const AVAILABLE_MODS = {
  sentinel: require("./sentinel"),
  biosense: require("./biosense"),
  jarvis: require("./jarvis"),
};

// Garde utilisée quand Sentinel est désactivé : laisse tout passer.
const passThroughGuard = {
  inspect: () => ({ verdict: "allow", reasons: [] }),
};

function parseModList(value) {
  return String(value || "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
}

function loadMods(enabledNames) {
  const enabled = Object.keys(AVAILABLE_MODS).filter((name) =>
    enabledNames.includes(name)
  );
  const unknown = enabledNames.filter((name) => !AVAILABLE_MODS[name]);
  if (unknown.length > 0) {
    console.warn(`[mods] Mods inconnus ignorés : ${unknown.join(", ")}`);
  }

  const instances = {};
  const context = {
    getMod: (name) => instances[name],
    guard: () => (instances.sentinel ? instances.sentinel.service : passThroughGuard),
  };

  const router = express.Router();

  for (const name of enabled) {
    const mod = AVAILABLE_MODS[name];
    instances[name] = mod.create(context);
    router.use(`/${name}`, instances[name].router);
  }

  router.get("/", (req, res) => {
    res.json(enabled.map((name) => AVAILABLE_MODS[name].manifest));
  });

  return { router, enabled, instances };
}

module.exports = { loadMods, parseModList, AVAILABLE_MODS };
