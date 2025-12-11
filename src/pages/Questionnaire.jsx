// rfce
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { estimateBySource, adjustEstimateWithAnswers } from "../utils/estimateFromSource";

function Questionnaire() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    taste: "normal",
    clarity: "clear",
    scaling: "no",
    smell: "normal",
    hasRO: "no"
  });

  const [profile, setProfile] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("user");
    if (!email) {
      navigate("/login");
      return;
    }
    const u = JSON.parse(localStorage.getItem("userData")) || {};
    setProfile(u);
  }, [navigate]);

  const updateAnswer = (key) => (e) => {
    setAnswers({ ...answers, [key]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = localStorage.getItem("user");
    if (!email) return;

    // 1) Base estimate based on source
    const baseEstimate = estimateBySource({
      source: profile?.source || "Tap Water",
      state: profile?.state,
      district: profile?.district
    });

    // 2) Strong adjustment based on questionnaire
    const finalEstimate = adjustEstimateWithAnswers(baseEstimate, answers);

    const payload = {
      ph: finalEstimate.ph,
      tds: finalEstimate.tds,
      turbidity: finalEstimate.turbidity,
      temp: finalEstimate.temp,
      method: "questionnaire",
      date: new Date().toISOString().slice(0, 10),
      note: finalEstimate.note
    };

    // Save reading
    const existing = JSON.parse(localStorage.getItem(`readings_${email}`)) || [];
    localStorage.setItem(`readings_${email}`, JSON.stringify([payload, ...existing]));

    setOpenSnack(true);

    setTimeout(() => {
      navigate("/reports");
    }, 1000);
  };

  if (!profile) return null;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box sx={{ p: 4, mt: 10 }}>
          <Paper sx={{ p: 4, maxWidth: 820 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Quick Water Quality Questionnaire
            </Typography>

            <form onSubmit={handleSubmit}>
              {/* TASTE */}
              <Typography>1) How does the water taste?</Typography>
              <RadioGroup value={answers.taste} onChange={updateAnswer("taste")} row>
                <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                <FormControlLabel value="salty" control={<Radio />} label="Salty" />
                <FormControlLabel value="bitter" control={<Radio />} label="Bitter" />
              </RadioGroup>

              <br />

              {/* CLARITY */}
              <Typography>2) Is the water clear or cloudy?</Typography>
              <RadioGroup value={answers.clarity} onChange={updateAnswer("clarity")} row>
                <FormControlLabel value="clear" control={<Radio />} label="Clear" />
                <FormControlLabel value="slightly-cloudy" control={<Radio />} label="Slightly Cloudy" />
                <FormControlLabel value="cloudy" control={<Radio />} label="Cloudy" />
              </RadioGroup>

              <br />

              {/* SCALING */}
              <Typography>3) Do utensils show white scaling?</Typography>
              <RadioGroup value={answers.scaling} onChange={updateAnswer("scaling")} row>
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              </RadioGroup>

              <br />

              {/* SMELL */}
              <Typography>4) Does the water have an unusual smell?</Typography>
              <RadioGroup value={answers.smell} onChange={updateAnswer("smell")} row>
                <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                <FormControlLabel value="odor" control={<Radio />} label="Odor Present" />
              </RadioGroup>

              <br />

              {/* RO */}
              <Typography>5) Do you have an RO purifier?</Typography>
              <RadioGroup value={answers.hasRO} onChange={updateAnswer("hasRO")} row>
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              </RadioGroup>

              <br />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" type="submit">Save Estimated Reading</Button>
                <Button variant="outlined" onClick={() => navigate("/add-reading")}>
                  Back
                </Button>
              </Box>
            </form>
          </Paper>

          <Snackbar
            open={openSnack}
            autoHideDuration={1200}
            onClose={() => setOpenSnack(false)}
            message="Estimated reading saved"
          />
        </Box>
      </Box>
    </div>
  );
}

export default Questionnaire;
