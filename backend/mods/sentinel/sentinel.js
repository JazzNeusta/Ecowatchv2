// Sentinel : l'IA qui contrôle les IA.
// Chaque mod lui soumet ce qui entre (question de l'utilisateur) et ce qui
// sort (réponse d'une IA). Sentinel renvoie un verdict et garde un journal.

const MAX_INPUT_LENGTH = 4000;
const JOURNAL_SIZE = 500;

// Tentatives de détournement des instructions d'une IA.
const INJECTION_PATTERNS = [
  /ignore[sz]?\s+(all\s+|toutes?\s+)?(the\s+|les\s+|tes\s+|vos\s+)?(previous|prior|above|pr[ée]c[ée]dentes?)?\s*(instructions|consignes|r[èe]gles)/i,
  /oublie[sz]?\s+(toutes?\s+)?(tes|vos|les)\s+(instructions|consignes|r[èe]gles)/i,
  /(system|syst[èe]me)\s*prompt/i,
  /tu\s+n'?es\s+plus\s+(un|une)\s+(assistant|ia)/i,
  /jailbreak|mode\s+d[ée]veloppeur|developer\s+mode/i,
];

// Données qui ne doivent jamais sortir d'une IA.
const SECRET_PATTERNS = [
  /\bsk-[A-Za-z0-9_-]{16,}/,
  /\b(MISTRAL|OPENAI|ANTHROPIC|AWS_SECRET)[A-Z_]*\s*[=:]\s*\S+/i,
  /postgres(ql)?:\/\/[^\s:]+:[^\s@]+@/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

// Tolérances pour comparer une valeur citée par une IA aux mesures réelles.
const TOLERANCE_DEGREES = 2;
const TOLERANCE_PERCENT = 5;

function parseNumber(raw) {
  return Number.parseFloat(raw.replace(",", "."));
}

function extractValues(text, unitPattern) {
  const regex = new RegExp(`(-?\\d+(?:[.,]\\d+)?)\\s*${unitPattern}`, "g");
  return [...text.matchAll(regex)].map((match) => parseNumber(match[1]));
}

function matchesReference(value, references) {
  return references.some((reference) => reference === value);
}

// Vérifie que les valeurs citées dans le texte correspondent aux mesures.
// `facts.references` liste des valeurs légitimes qui ne sont pas des mesures
// (seuils d'une plante, par exemple) : elles sont acceptées telles quelles.
function checkConsistency(text, facts) {
  const reasons = [];
  const references = (facts.references || []).filter(Number.isFinite);
  const degrees = [facts.temperature, facts.humidex].filter(Number.isFinite);
  const percents = [facts.humidity, facts.soilMoisture].filter(Number.isFinite);

  if (degrees.length > 0) {
    for (const value of extractValues(text, "°\\s*C")) {
      if (matchesReference(value, references)) continue;
      if (!degrees.some((fact) => Math.abs(fact - value) <= TOLERANCE_DEGREES)) {
        reasons.push(`Valeur ${value} °C absente des mesures (${degrees.join(", ")} °C)`);
      }
    }
  }

  if (percents.length > 0) {
    for (const value of extractValues(text, "%")) {
      if (matchesReference(value, references)) continue;
      if (!percents.some((fact) => Math.abs(fact - value) <= TOLERANCE_PERCENT)) {
        reasons.push(`Valeur ${value} % absente des mesures (${percents.join(", ")} %)`);
      }
    }
  }

  return reasons;
}

function inspectInput(text) {
  if (text.length > MAX_INPUT_LENGTH) {
    return { verdict: "block", reasons: [`Message trop long (${text.length} > ${MAX_INPUT_LENGTH} caractères)`] };
  }
  if (INJECTION_PATTERNS.some((pattern) => pattern.test(text))) {
    return { verdict: "block", reasons: ["Tentative de détournement des instructions de l'IA"] };
  }
  return { verdict: "allow", reasons: [] };
}

function inspectOutput(text, facts) {
  if (SECRET_PATTERNS.some((pattern) => pattern.test(text))) {
    return { verdict: "block", reasons: ["La réponse contient une donnée secrète (clé, mot de passe…)"] };
  }
  if (text.trim() === "") {
    return { verdict: "flag", reasons: ["Réponse vide"] };
  }
  const reasons = facts ? checkConsistency(text, facts) : [];
  return { verdict: reasons.length > 0 ? "flag" : "allow", reasons };
}

function createSentinel({ journalSize = JOURNAL_SIZE } = {}) {
  const journal = [];
  let nextId = 1;

  function inspect({ source, direction, text, facts }) {
    const content = String(text || "");
    const result = direction === "input" ? inspectInput(content) : inspectOutput(content, facts);

    const entry = {
      id: nextId++,
      at: new Date().toISOString(),
      source,
      direction,
      verdict: result.verdict,
      reasons: result.reasons,
      excerpt: content.slice(0, 200),
    };
    journal.unshift(entry);
    journal.length = Math.min(journal.length, journalSize);

    return { ...result, id: entry.id };
  }

  function getJournal(limit = 50) {
    return journal.slice(0, limit);
  }

  function getStats() {
    const stats = { total: journal.length, allow: 0, flag: 0, block: 0, bySource: {} };
    for (const entry of journal) {
      stats[entry.verdict] += 1;
      stats.bySource[entry.source] = (stats.bySource[entry.source] || 0) + 1;
    }
    return stats;
  }

  return { inspect, getJournal, getStats };
}

module.exports = { createSentinel, checkConsistency };
