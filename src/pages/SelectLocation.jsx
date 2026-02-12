// rfce
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  Divider
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function SelectLocation() {
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const email = storedUser.email;

    // Load saved locations
    const saved =
      JSON.parse(localStorage.getItem(`locations_${email}`)) || [];

    setLocations(saved);

    // Get live GPS
    getLiveLocation();
  }, [navigate]);

  const getLiveLocation = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "Unknown Location";

        setCurrentLocation({
          locationName: city,
          stateName: data.address.state || "",
          district: city,
          latitude,
          longitude,
        });
      } catch (error) {
        console.error("Reverse geocoding error:", error);
      }
    },
    (error) => {
      console.error("Location error:", error);
    }
  );
};

  const handleContinue = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const email = storedUser?.email;

    if (!email || selectedIndex === null) return;

    let selectedLocation;

    if (selectedIndex === "current") {
      selectedLocation = currentLocation;
    } else {
      selectedLocation = locations[selectedIndex];
    }

    localStorage.setItem(
      `selectedLocation_${email}`,
      JSON.stringify(selectedLocation)
    );

    setOpenSnack(true);

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 4 }}>
        <Paper sx={{ p: 4, width: "50%", mx: "auto" }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Select Location to Monitor
          </Typography>

          {/* LIVE LOCATION */}
          {currentLocation && (
            <>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Live Location
              </Typography>

              <Button
                variant={selectedIndex === "current" ? "contained" : "outlined"}
                fullWidth
                sx={{ mb: 3 }}
                onClick={() => setSelectedIndex("current")}
              >
                📍 {currentLocation.district}
              </Button>

              <Divider sx={{ mb: 3 }} />
            </>
          )}

          {/* SAVED LOCATIONS */}
          <Typography sx={{ mb: 1, fontWeight: 600 }}>
            Saved Locations
          </Typography>

          {locations.length === 0 && (
            <Typography sx={{ mb: 2, color: "gray" }}>
              No locations added yet.
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
            fullWidth
            disabled={selectedIndex === null}
            sx={{ mt: 2 }}
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
        message="Monitoring location selected ✔"
      />
    </div>
  );
}

export default SelectLocation;
