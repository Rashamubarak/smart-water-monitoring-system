// rfce
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import WaterCard from '../components/Cards/WaterCard'
import LineChart from '../components/Charts/LineChart'
import PieChart from '../components/Charts/PieChart'
import GaugeChart from '../components/Charts/GaugeChart'
import { Box, Typography,Paper } from '@mui/material'
import { districtProfiles } from "../utils/districtProfiles";

function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [latestReading, setLatestReading] = useState(null);
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("user");

    // Load selected location for THIS user
    const loc = JSON.parse(localStorage.getItem(`selectedLocation_${email}`));
    setSelectedLocation(loc);

    // Load readings for this user
    const data = JSON.parse(localStorage.getItem(`readings_${email}`)) || [];
    setReadings(data);

    // Latest reading is first (newest) reading
    if (data.length > 0) {
      setLatestReading(data[0]);
    }
  }, []);
  
// Compare user's reading with district profile
let comparison = {
  ph: "",
  tds: "",
  turbidity: ""
};

if (selectedLocation && latestReading) {
  const profile =
    districtProfiles[selectedLocation.stateName]?.[selectedLocation.district];

  if (profile) {
    // pH comparison
    if (latestReading.ph > profile.ph + 0.3) {
      comparison.ph = "Your pH is slightly higher than typical for this area.";
    } else if (latestReading.ph < profile.ph - 0.3) {
      comparison.ph = "Your pH is lower than average for this district.";
    } else {
      comparison.ph = "pH is within the usual range for this region.";
    }

    // TDS comparison
    if (latestReading.tds > profile.tds + 100) {
      comparison.tds = "TDS is significantly higher than expected in this area.";
    } else if (latestReading.tds < profile.tds - 100) {
      comparison.tds = "TDS is unusually low compared to local groundwater.";
    } else {
      comparison.tds = "TDS is normal for this location.";
    }

    // Turbidity comparison
    if (latestReading.turbidity > profile.turbidity + 1) {
      comparison.turbidity =
        "Turbidity is higher than usual — possible contamination.";
    } else if (latestReading.turbidity < profile.turbidity - 0.5) {
      comparison.turbidity = "Turbidity is cleaner than typical for this area.";
    } else {
      comparison.turbidity = "Turbidity is normal for this district.";
    }
  }
}

  // Determine water status for KPI cards
  const getStatus = (value, type) => {
    if (type === "ph") {
      if (value >= 6.5 && value <= 8.5) return "safe";
      return "danger";
    }
    if (type === "tds") {
      if (value <= 500) return "safe";
      if (value <= 900) return "warning";
      return "danger";
    }
    if (type === "turbidity") {
      if (value <= 1) return "safe";
      if (value <= 5) return "warning";
      return "danger";
    }
    return "safe";
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{
        flex: 1,
        padding: '20px',
        background: '#f5f7fa',
        minHeight: "100vh"
      }}>

        <h1 style={{ marginBottom: '20px' }}>Dashboard</h1>

        {/* SELECTED LOCATION INFO */}
        {selectedLocation ? (
          <Typography sx={{ mb: 3, fontSize: "18px", color: "#333" }}>
            Monitoring Location:
            <strong> {selectedLocation.locationName}</strong>
            ({selectedLocation.stateName}, {selectedLocation.district})
          </Typography>
        ) : (
          <Typography sx={{ mb: 3, color: "gray" }}>
            No location selected yet.
          </Typography>
        )}

        {/* KPI CARDS */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <WaterCard
            title="pH Level"
            value={latestReading ? latestReading.ph : "--"}
            status={latestReading ? getStatus(latestReading.ph, "ph") : "safe"}
          />

          <WaterCard
            title="TDS (ppm)"
            value={latestReading ? latestReading.tds : "--"}
            status={latestReading ? getStatus(latestReading.tds, "tds") : "safe"}
          />

          <WaterCard
            title="Turbidity"
            value={latestReading ? `${latestReading.turbidity} NTU` : "--"}
            status={latestReading ? getStatus(latestReading.turbidity, "turbidity") : "safe"}
          />
        </Box>
{/* LOCATION-BASED ANALYSIS CARD */}
{selectedLocation && latestReading && (
  <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
      Location-Based Water Analysis
    </Typography>

    <Typography sx={{ mb: 1 }}>
      <strong>pH Analysis:</strong> {comparison.ph}
    </Typography>

    <Typography sx={{ mb: 1 }}>
      <strong>TDS Analysis:</strong> {comparison.tds}
    </Typography>

    <Typography sx={{ mb: 1 }}>
      <strong>Turbidity Analysis:</strong> {comparison.turbidity}
    </Typography>
  </Paper>
)}

        {/* CHARTS SECTION */}
        <Box sx={{ display: 'flex', gap: 3, mt: 5 }}>
          {/* Left side: Line chart */}
          <Box sx={{ flex: 2 }}>
            <LineChart readings={readings} />
          </Box>

          {/* Right side: Gauge + Pie chart */}
          <Box sx={{ flex: 1 }}>
            {/* FIXED: Correct prop name */}
            <GaugeChart reading={latestReading} />

            <PieChart readings={readings} />
          </Box>
        </Box>

      </div>
    </div>
  );
}

export default Dashboard;
