// src/pages/AddReading.jsx
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

import api from "../services/api";
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
  const [profile, setProfile] = useState(null);

  // 🔐 Must be logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const u = JSON.parse(localStorage.getItem("userData"));
    setProfile(u || null);
  }, [navigate]);

  // Handle input
  const handleChange = (e) => {
    setReading({ ...reading, [e.target.name]: e.target.value });
  };

  // ✅ SAVE TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reading.ph || !reading.tds || !reading.turbidity) {
      setOpenSnack(true);
      return;
    }

    try {
      await api.post("/water", {
        ph: reading.ph,
        tds: reading.tds,
        turbidity: reading.turbidity,
        temp: reading.temp,
      });

      setOpenSnack(true);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save reading");
    }
  };

  // 🔁 Auto estimate from profile
  const handleAutoEstimate = () => {
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

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button type="submit" variant="contained">
                  Save Reading
                </Button>

                <Button variant="outlined" onClick={handleAutoEstimate}>
                  Auto Estimate
                </Button>

                <Button variant="text" onClick={() => navigate("/reports")}>
                  View Reports
                </Button>
              </Box>
            </form>
          </Paper>

          <Snackbar
            open={openSnack}
            autoHideDuration={1500}
            onClose={() => setOpenSnack(false)}
            message="Reading saved successfully"
          />
        </Box>
      </Box>
    </div>
  );
}

export default AddReading;
