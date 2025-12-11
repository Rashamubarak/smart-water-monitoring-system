// simple random data generators (if not added already)
export const getRandomPH = () => (6.5 + Math.random() * 2).toFixed(2);
export const getRandomTDS = () => Math.floor(100 + Math.random() * 600);
export const getRandomTurbidity = () => Math.floor(Math.random() * 10);

// check for unsafe conditions and return list of alerts
export const getAlertsForReading = (reading) => {
  const alerts = [];

  const { ph, tds, turbidity } = reading;

  // pH safe range: 6.5 – 8.5
  if (ph < 6.5 || ph > 8.5) {
    alerts.push({
      type: "warning",
      message: `pH level (${ph}) is outside safe range (6.5 - 8.5).`,
    });
  }

  // TDS safe: < 500 ppm
  if (tds > 500) {
    alerts.push({
      type: "error",
      message: `TDS is high (${tds} ppm). Recommended < 500 ppm.`,
    });
  }

  // Turbidity safe: < 5 NTU
  if (turbidity > 5) {
    alerts.push({
      type: "warning",
      message: `Turbidity is high (${turbidity} NTU). Water is not clear.`,
    });
  }

  return alerts;
};
export const getRecommendations = (reading) => {
  const list = [];

  const { ph, tds, turbidity } = reading;

  if (tds > 500) {
    list.push("Use an RO filter or bottled water temporarily.");
  }
  if (turbidity > 5) {
    list.push("Boil water and use sediment filter.");
  }
  if (ph < 6.5) {
    list.push("Water is acidic. Avoid drinking directly.");
  }
  if (ph > 8.5) {
    list.push("Water is alkaline. Use proper filtration.");
  }

  if (list.length === 0) {
    list.push("Water looks safe. No action required 🌿");
  }

  return list;
};
export const getWHOComparison = (reading) => {
  return [
    {
      label: "pH",
      value: reading.ph,
      safeRange: "6.5 - 8.5",
      status: reading.ph >= 6.5 && reading.ph <= 8.5 ? "Safe" : "Unsafe",
    },
    {
      label: "TDS (ppm)",
      value: reading.tds,
      safeRange: "< 500",
      status: reading.tds < 500 ? "Safe" : "Unsafe",
    },
    {
      label: "Turbidity (NTU)",
      value: reading.turbidity,
      safeRange: "< 5",
      status: reading.turbidity < 5 ? "Safe" : "Unsafe",
    },
  ];
};
