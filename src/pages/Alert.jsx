// rfce
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Paper,
  Typography,
  Alert,
  Stack,
  Button,
  Snackbar
} from "@mui/material";

import {
  getAlertsForReading,
  getRecommendations,
  getWHOComparison,
  getRandomPH,
  getRandomTDS,
  getRandomTurbidity
} from "../utils/dataSimulation";

function Alerts() {
  const [reading, setReading] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);

  // Load real latest reading
  useEffect(() => {
    const email = localStorage.getItem("user");
    const data = JSON.parse(localStorage.getItem(`readings_${email}`)) || [];

    if (data.length > 0) {
      setReading(data[0]); // latest reading
      evaluateAll(data[0]);
    }
  }, []);

  const evaluateAll = (sample) => {
    setAlerts(getAlertsForReading(sample));
    setRecommendations(getRecommendations(sample));
  };

  const handleNewSample = () => {
    const newSample = {
      ph: parseFloat(getRandomPH()),
      tds: getRandomTDS(),
      turbidity: getRandomTurbidity(),
    };

    setReading(newSample);
    evaluateAll(newSample);
    setOpenSnack(true);
  };

  if (!reading) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flex: 1, p: 4 }}>
          <Typography>No readings found. Please add a reading first.</Typography>
        </Box>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 4 }}>

        {/* Reading Summary */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Alerts & Safety Status
          </Typography>

          <Typography variant="body1">
            pH: <b>{reading.ph}</b> | TDS: <b>{reading.tds} ppm</b> | Turbidity:{" "}
            <b>{reading.turbidity} NTU</b>
          </Typography>

          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleNewSample}>
            Simulate New Sample
          </Button>
        </Paper>

        {/* Alert Messages */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Alert Messages
          </Typography>

          {alerts.length === 0 ? (
            <Alert severity="success">
              All parameters are within safe limits ✔️
            </Alert>
          ) : (
            <Stack spacing={2}>
              {alerts.map((a, i) => (
                <Alert key={i} severity={a.type}>
                  {a.message}
                </Alert>
              ))}
            </Stack>
          )}
        </Paper>

        {/* Recommendations */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Health Recommendations
          </Typography>

          <Stack spacing={1}>
            {recommendations.map((rec, i) => (
              <Typography key={i}>• {rec}</Typography>
            ))}
          </Stack>
        </Paper>

        {/* WHO Comparison */}
        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>WHO Comparison</Typography>

          {getWHOComparison(reading).map((item, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography>
                {item.label}: <b>{item.value}</b> | Safe Range: {item.safeRange}
              </Typography>

              <Typography
                color={item.status === "Safe" ? "green" : "red"}
                sx={{ fontWeight: "bold" }}
              >
                Status: {item.status}
              </Typography>
            </Box>
          ))}
        </Paper>

        <Snackbar
          open={openSnack}
          autoHideDuration={1500}
          onClose={() => setOpenSnack(false)}
          message="New sample generated"
        />
      </Box>
    </div>
  );
}

export default Alerts;
