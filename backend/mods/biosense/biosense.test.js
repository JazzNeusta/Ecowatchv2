const test = require("node:test");
const assert = require("node:assert/strict");
const { computeHumidex, humidexLevel } = require("./humidex");
const { recommend } = require("./recommend");

test("calcule l'humidex comme le firmware AquaCheck", () => {
  // Valeurs de référence : 30 °C et 70 % d'humidité donnent environ 40.
  assert.ok(Math.abs(computeHumidex(30, 70) - 40.5) < 1);
  assert.ok(computeHumidex(20, 40) < 22);
});

test("classe l'humidex sur l'échelle de confort", () => {
  assert.equal(humidexLevel(25).level, "confort");
  assert.equal(humidexLevel(37).level, "inconfort");
  assert.equal(humidexLevel(60).level, "extreme");
});

test("signale les conditions idéales", () => {
  const result = recommend({ plant: "basilic", temperature: 22, humidity: 55, soilMoisture: 50 });
  assert.equal(result.recommendations.length, 1);
  assert.equal(result.recommendations[0].severity, "success");
});

test("alerte sur un humidex trop élevé et un sol sec", () => {
  const result = recommend({ plant: "basilic", temperature: 32, humidity: 70, soilMoisture: 20 });
  const severities = result.recommendations.map((item) => item.severity);
  assert.ok(severities.includes("danger"));
  assert.ok(result.recommendations.some((item) => item.message.startsWith("Sol trop sec")));
});

test("ignore l'humidité du sol quand elle n'est pas mesurée", () => {
  const result = recommend({ plant: "cactus", temperature: 25, humidity: 30 });
  assert.equal(result.recommendations[0].severity, "success");
});

test("refuse une plante inconnue ou des mesures manquantes", () => {
  assert.throws(() => recommend({ plant: "baobab", temperature: 20, humidity: 50 }), /Plante inconnue/);
  assert.throws(() => recommend({ plant: "basilic", humidity: 50 }), /obligatoires/);
});
