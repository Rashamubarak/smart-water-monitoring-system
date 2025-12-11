// rfce
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function SelectLocation() {
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("user"); // current logged-in user

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    // Load locations ONLY for this user
    const data = JSON.parse(localStorage.getItem(`locations_${email}`)) || [];
    setLocations(data);
  }, [email, navigate]);

  const handleContinue = () => {
    if (selectedIndex === null) return;

    const selectedLocation = locations[selectedIndex];

    // save selected location for this user ONLY
    localStorage.setItem(
      `selectedLocation_${email}`,
      JSON.stringify(selectedLocation)
    );

    setOpenSnack(true);

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 4 }}>
        <Paper sx={{ p: 4, width: "50%" }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Select Location to Monitor
          </Typography>

          {locations.length === 0 && (
            <Typography sx={{ mb: 2, color: "gray" }}>
              No locations added yet. Please add one first.
            </Typography>
          )}

          {locations.map((loc, i) => (
            <Button
              key={i}
              variant={selectedIndex === i ? "contained" : "outlined"}
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => setSelectedIndex(i)}
            >
              {loc.locationName} ({loc.stateName}, {loc.district})
            </Button>
          ))}

          <Button
            variant="contained"
            disabled={selectedIndex === null}
            onClick={handleContinue}
          >
            Continue to Dashboard
          </Button>
        </Paper>
      </Box>

      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => setOpenSnack(false)}
        message="Loading Dashboard..."
      />
    </div>
  );
}

export default SelectLocation;
