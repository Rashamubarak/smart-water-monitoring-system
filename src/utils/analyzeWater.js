// src/utils/analyzeWater.js
export const SAFE = {
  ph: { min: 6.5, max: 8.5 },
  tds: { max: 500 }, // ppm
  turbidity: { max: 5 }, // NTU
};

// return array of alert objects
export function getAlertsForReading(reading) {
  const alerts = [];
  const ph = parseFloat(reading.ph);
  const tds = parseFloat(reading.tds);
  const turbidity = parseFloat(reading.turbidity);

  if (isNaN(ph) || isNaN(tds) || isNaN(turbidity)) {
    alerts.push({ type: "warning", message: "Incomplete numeric data." });
    return alerts;
  }

  if (ph < SAFE.ph.min || ph > SAFE.ph.max) {
    alerts.push({
      type: "warning",
      message: `pH (${ph}) outside safe range (${SAFE.ph.min} - ${SAFE.ph.max}).`,
    });
  }
  if (tds > SAFE.tds.max) {
    alerts.push({
      type: "error",
      message: `TDS (${tds} ppm) above safe limit (< ${SAFE.tds.max} ppm).`,
    });
  }
  if (turbidity > SAFE.turbidity.max) {
    alerts.push({
      type: "warning",
      message: `Turbidity (${turbidity} NTU) above safe limit (< ${SAFE.turbidity.max} NTU).`,
    });
  }

  return alerts;
}

export function getRecommendations(reading) {
  const recs = [];
  const ph = parseFloat(reading.ph);
  const tds = parseFloat(reading.tds);
  const turbidity = parseFloat(reading.turbidity);

  if (tds > SAFE.tds.max) recs.push("Use RO or bottled water until TDS reduces.");
  if (turbidity > SAFE.turbidity.max) recs.push("Boil water and use sediment filtration.");
  if (ph < SAFE.ph.min) recs.push("Water is acidic – avoid direct consumption.");
  if (ph > SAFE.ph.max) recs.push("Water is alkaline – consider correction/filtration.");
  if (recs.length === 0) recs.push("Water looks safe. No action required.");

  return recs;
}

export function getWHOComparison(reading) {
  return [
    {
      label: "pH",
      value: reading.ph,
      safeRange: `${SAFE.ph.min} - ${SAFE.ph.max}`,
      status:
        reading.ph >= SAFE.ph.min && reading.ph <= SAFE.ph.max ? "Safe" : "Unsafe",
    },
    {
      label: "TDS (ppm)",
      value: reading.tds,
      safeRange: `< ${SAFE.tds.max}`,
      status: reading.tds < SAFE.tds.max ? "Safe" : "Unsafe",
    },
    {
      label: "Turbidity (NTU)",
      value: reading.turbidity,
      safeRange: `< ${SAFE.turbidity.max}`,
      status: reading.turbidity < SAFE.turbidity.max ? "Safe" : "Unsafe",
    },
  ];
}

// readings: array of {date, ph, tds, turbidity, temp}
// returns last N readings and monthly stats for given month (YYYY-MM)
export function monthlySummary(readings, monthKey) {
  // monthKey format "YYYY-MM" e.g. "2025-12"
  const list = readings.filter((r) => r.date && r.date.startsWith(monthKey));
  if (list.length === 0) return null;

  const avg = list.reduce(
    (acc, cur) => {
      acc.ph += parseFloat(cur.ph || 0);
      acc.tds += parseFloat(cur.tds || 0);
      acc.turbidity += parseFloat(cur.turbidity || 0);
      acc.temp += parseFloat(cur.temp || 0);
      return acc;
    },
    { ph: 0, tds: 0, turbidity: 0, temp: 0 }
  );

  const n = list.length;
  return {
    count: n,
    avgPh: +(avg.ph / n).toFixed(2),
    avgTds: Math.round(avg.tds / n),
    avgTurbidity: +(avg.turbidity / n).toFixed(2),
    avgTemp: +(avg.temp / n).toFixed(2),
  };
}
