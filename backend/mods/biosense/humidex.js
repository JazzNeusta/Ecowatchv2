// Même calcul que le firmware AquaCheck (src/Managers/SensorManager.cpp),
// pour que BioSense affiche les mêmes valeurs que les capteurs.
function computeHumidex(temperature, humidity) {
  const dewPoint = temperature - (100 - humidity) / 5;
  const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (273.15 + dewPoint)));
  return temperature + 0.5555 * (e - 10);
}

// Échelle de confort d'Environnement Canada.
const HUMIDEX_LEVELS = [
  { max: 29, level: "confort", label: "Aucun inconfort" },
  { max: 34, level: "leger", label: "Léger inconfort" },
  { max: 39, level: "inconfort", label: "Inconfort, éviter les efforts" },
  { max: 45, level: "important", label: "Inconfort important" },
  { max: 53, level: "danger", label: "Danger" },
  { max: Infinity, level: "extreme", label: "Coup de chaleur imminent" },
];

function humidexLevel(humidex) {
  return HUMIDEX_LEVELS.find((entry) => humidex <= entry.max);
}

module.exports = { computeHumidex, humidexLevel };
