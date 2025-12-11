// src/pages/AddReading.jsx
// rfce
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { estimateBySource } from "../utils/estimateFromSource";

function AddReading() {
  const navigate = useNavigate();

  const [reading, setReading] = useState({
    ph: "",
    tds: "",
    turbidity: "",
    temp: "",
    date: new Date().toISOString().slice(0, 10),
    locationName: "",
  });

  const [openSnack, setOpenSnack] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("user");
    if (!email) navigate("/login");
    const arr = JSON.parse(localStorage.getItem(`readings_${email}`)) || [];
    setSavedCount(arr.length);

    const u = JSON.parse(localStorage.getItem("userData"));
    setProfile(u || null);
  }, [navigate]);

  const handleChange = (e) => {
    setReading({ ...reading, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = localStorage.getItem("user");
    if (!email) {
      navigate("/login");
      return;
    }

    if (!reading.ph || !reading.tds || !reading.turbidity) {
      setOpenSnack(true);
      return;
    }

    const payload = {
      ph: reading.ph,
      tds: reading.tds,
      turbidity: reading.turbidity,
      temp: reading.temp || "",
      date: reading.date,
      locationName: reading.locationName || "",
      method: "manual",
    };

    const existing = JSON.parse(localStorage.getItem(`readings_${email}`)) || [];
    localStorage.setItem(`readings_${email}`, JSON.stringify([payload, ...existing]));
    setOpenSnack(true);
    setSavedCount(existing.length + 1);

    setTimeout(() => {
      navigate("/reports");
    }, 800);
  };

  const handleAutoEstimate = () => {
    // use profile's state/district/source to estimate
    const base = estimateBySource({
      source: profile?.source || "Tap Water",
      state: profile?.state,
      district: profile?.district,
    });

    setReading((r) => ({
      ...r,
      ph: base.ph,
      tds: base.tds,
      turbidity: base.turbidity,
      temp: base.temp,
    }));
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Topbar />
        <Box sx={{ p: 4, mt: 10 }}>
          <Paper sx={{ p: 3, maxWidth: 720 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Add New Water Reading
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Date"
                type="date"
                name="date"
                fullWidth
                sx={{ mb: 2 }}
                value={reading.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="pH"
                name="ph"
                fullWidth
                sx={{ mb: 2 }}
                value={reading.ph}
                onChange={handleChange}
                required
              />

              <TextField
                label="TDS (ppm)"
                name="tds"
                fullWidth
                sx={{ mb: 2 }}
                value={reading.tds}
                onChange={handleChange}
                required
              />

              <TextField
                label="Turbidity (NTU)"
                name="turbidity"
                fullWidth
                sx={{ mb: 2 }}
                value={reading.turbidity}
                onChange={handleChange}
                required
              />

              <TextField
                label="Temperature (°C)"
                name="temp"
                fullWidth
                sx={{ mb: 2 }}
                value={reading.temp}
                onChange={handleChange}
              />

              <TextField
                label="Location name (optional)"
                name="locationName"
                fullWidth
                sx={{ mb: 2 }}
                value={reading.locationName}
                onChange={handleChange}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button type="submit" variant="contained">
                  Save Reading (Manual)
                </Button>

                <Button variant="outlined" onClick={handleAutoEstimate}>
                  Auto Estimate (from profile)
                </Button>

                <Button variant="outlined" onClick={() => navigate("/questionnaire")}>
                  Smart Questionnaire
                </Button>

                <Button variant="text" onClick={() => navigate("/reports")}>
                  View Reports ({savedCount})
                </Button>
              </Box>
            </form>
          </Paper>

          <Snackbar
            open={openSnack}
            autoHideDuration={1500}
            onClose={() => setOpenSnack(false)}
            message="Reading saved"
          />
        </Box>
      </Box>
    </div>
  );
}

export default AddReading;
