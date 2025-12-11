// src/utils/estimateFromSource.js

// Base values depending on water source
const SOURCE_BASE = {
  "Tap Water": { ph: 7.2, tds: 250, turbidity: 1.0, temp: 27 },
  "Borewell": { ph: 7.0, tds: 450, turbidity: 2.0, temp: 28 },
  "Well Water": { ph: 6.9, tds: 380, turbidity: 3.0, temp: 27 },
  "RO Tank": { ph: 7.0, tds: 50, turbidity: 0.5, temp: 26 },
  "Tanker": { ph: 7.1, tds: 300, turbidity: 4.0, temp: 27 },
};

// helper for slight randomness
function jitter(v, pct = 0.06) {
  const amount = v * pct * (Math.random() * 2 - 1);
  return Math.round((v + amount) * 100) / 100;
}

// Main estimator
export function estimateBySource({ state, district, source }) {
  const base = SOURCE_BASE[source] || SOURCE_BASE["Tap Water"];

  return {
    ph: jitter(base.ph, 0.04),
    tds: Math.round(jitter(base.tds, 0.08)),
    turbidity: Math.round(jitter(base.turbidity, 0.12) * 100) / 100,
    temp: Math.round(jitter(base.temp, 0.03) * 10) / 10,
    method: "auto",
    note: `Estimated from ${source}${state ? ", " + state : ""}${district ? ", " + district : ""}`
  };
}

// MUCH STRONGER Questionnaire adjustments
export function adjustEstimateWithAnswers(base, answers) {
  const result = { ...base };

  // TASTE
  if (answers.taste === "salty") {
    result.tds = Math.round(result.tds * 1.8);  // Strong impact
  }
  if (answers.taste === "bitter") {
    result.ph = Math.round((result.ph + 1.2) * 100) / 100;
  }

  // CLARITY
  if (answers.clarity === "slightly-cloudy") {
    result.turbidity = 3 + Math.random() * 2;  // 3–5 NTU
  }
  if (answers.clarity === "cloudy") {
    result.turbidity = 6 + Math.random() * 6;  // 6–12 NTU
  }

  // SCALING
  if (answers.scaling === "yes") {
    result.tds = Math.round(result.tds * 1.5);
  }

  // SMELL
  if (answers.smell === "odor") {
    result.turbidity = 8 + Math.random() * 4; // 8–12 NTU
    result.tds = Math.round(result.tds * 1.3);
  }

  // RO
  if (answers.hasRO === "yes") {
    result.tds = Math.round(result.tds * 0.2);
    result.turbidity = (result.turbidity * 0.4).toFixed(2);
  }

  // rounding
  result.ph = Math.round(result.ph * 100) / 100;
  result.tds = Math.round(result.tds);
  result.turbidity = Math.round(result.turbidity * 100) / 100;
  result.method = "questionnaire";

  return result;
}
