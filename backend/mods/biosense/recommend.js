const plants = require("./plants.json");
const { computeHumidex, humidexLevel } = require("./humidex");

function findPlant(id) {
  return plants.find((plant) => plant.id === id);
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function checkRange(value, [min, max], { tooLow, tooHigh }) {
  if (!Number.isFinite(value)) return null;
  if (value < min) return { severity: "warning", message: tooLow(min) };
  if (value > max) return { severity: "warning", message: tooHigh(max) };
  return null;
}

// Produit des recommandations pour une plante à partir des mesures d'un capteur.
function recommend({ plant: plantId, temperature, humidity, soilMoisture }) {
  const plant = findPlant(plantId);
  if (!plant) {
    throw new Error(`Plante inconnue : ${plantId}`);
  }
  if (!Number.isFinite(temperature) || !Number.isFinite(humidity)) {
    throw new Error("La température et l'humidité sont obligatoires");
  }

  const humidex = round(computeHumidex(temperature, humidity));
  const level = humidexLevel(humidex);
  const recommendations = [];

  if (humidex > plant.maxHumidex) {
    recommendations.push({
      severity: "danger",
      message: `Humidex de ${humidex} °C : risque de stress thermique pour le ${plant.label.toLowerCase()} (maximum conseillé ${plant.maxHumidex} °C). Mettre à l'ombre et aérer.`,
    });
  }

  const checks = [
    checkRange(temperature, plant.temperature, {
      tooLow: (min) => `Température trop basse (${temperature} °C, minimum ${min} °C). Rapprocher d'une source de chaleur douce.`,
      tooHigh: (max) => `Température trop haute (${temperature} °C, maximum ${max} °C). Éloigner du soleil direct.`,
    }),
    checkRange(humidity, plant.humidity, {
      tooLow: (min) => `Air trop sec (${humidity} %, minimum ${min} %). Brumiser ou poser sur un lit de billes humides.`,
      tooHigh: (max) => `Air trop humide (${humidity} %, maximum ${max} %). Aérer pour éviter les moisissures.`,
    }),
    checkRange(soilMoisture, plant.soilMoisture, {
      tooLow: (min) => `Sol trop sec (${soilMoisture} %, minimum ${min} %). Arroser.`,
      tooHigh: (max) => `Sol trop humide (${soilMoisture} %, maximum ${max} %). Suspendre l'arrosage.`,
    }),
  ];
  recommendations.push(...checks.filter(Boolean));

  if (recommendations.length === 0) {
    recommendations.push({
      severity: "success",
      message: `Conditions idéales pour le ${plant.label.toLowerCase()}. ${plant.tips}`,
    });
  }

  return {
    plant: { id: plant.id, label: plant.label },
    thresholds: [
      ...plant.temperature,
      ...plant.humidity,
      ...plant.soilMoisture,
      plant.maxHumidex,
    ],
    humidex,
    level,
    recommendations,
  };
}

module.exports = { recommend, plants };
