// rfce
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Paper,
  Typography,
  Alert,
  Stack
} from "@mui/material";

import { getWaterData } from "../services/waterService";

function Alerts() {

  const [reading, setReading] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // ------------------------
  // Load latest reading from DB
  // ------------------------
  useEffect(() => {
    loadLatestReading();
  }, []);

  const loadLatestReading = async () => {
    try {
      const res = await getWaterData();

      if (res.data.length > 0) {
        const latest = res.data[0]; // newest first
        setReading(latest);
        generateAlerts(latest);
      }
    } catch (err) {
      console.error("Failed to load alerts:", err);
    }
  };

  // ------------------------
  // Generate alerts
  // ------------------------
  const generateAlerts = (r) => {
    const list = [];

    if (r.ph < 6.5 || r.ph > 8.5)
      list.push("pH out of safe range");

    if (r.tds > 500)
      list.push("High TDS detected");

    if (r.turbidity > 5)
      list.push("High turbidity level");

    setAlerts(list);
  };

  // ------------------------
  // UI
  // ------------------------
  if (!reading) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ p: 4 }}>
          <Typography>No readings found. Add a reading first.</Typography>
        </Box>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 4 }}>

        {/* Reading Summary */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5">Latest Water Reading</Typography>

          <Typography sx={{ mt: 1 }}>
            pH: <b>{reading.ph}</b> | 
            TDS: <b>{reading.tds} ppm</b> | 
            Turbidity: <b>{reading.turbidity} NTU</b>
          </Typography>
        </Paper>

        {/* Alerts */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Alert Messages
          </Typography>

          {alerts.length === 0 ? (
            <Alert severity="success">
              All parameters are within safe limits ✔
            </Alert>
          ) : (
            <Stack spacing={2}>
              {alerts.map((a, i) => (
                <Alert key={i} severity="warning">
                  {a}
                </Alert>
              ))}
            </Stack>
          )}
        </Paper>

      </Box>
    </div>
  );
}

export default Alerts;
