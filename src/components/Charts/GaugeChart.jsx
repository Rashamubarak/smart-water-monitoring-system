// rfce
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

// Safety calculation
function calculateSafetyScore(reading) {
  if (!reading) return 0;

  const { ph, tds, turbidity } = reading;

  let phScore = 100 - Math.abs(7 - ph) * 20;
  phScore = Math.max(0, Math.min(100, phScore));

  let tdsScore;
  if (tds <= 300) tdsScore = 100;
  else if (tds <= 500) tdsScore = 70;
  else if (tds <= 900) tdsScore = 40;
  else tdsScore = 10;

  let turbScore;
  if (turbidity <= 1) turbScore = 100;
  else if (turbidity <= 5) turbScore = 50;
  else turbScore = 10;

  const finalScore = Math.round(
    phScore * 0.3 + tdsScore * 0.4 + turbScore * 0.3
  );

  return finalScore;
}

function GaugeChart({ reading }) {
  const score = calculateSafetyScore(reading);

  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <CircularProgress
        variant="determinate"
        value={score}
        size={150}
        thickness={4}
      />
      <Typography variant="h5" sx={{ mt: 2 }}>
        {score}% Safe
      </Typography>
    </Box>
  );
}

export default GaugeChart;
