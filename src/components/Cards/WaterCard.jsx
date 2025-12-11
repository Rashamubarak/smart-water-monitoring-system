// rfce
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import OpacityIcon from "@mui/icons-material/Opacity";

function WaterCard({ title, value, status }) {
  const getColor = () => {
    if (status === "safe") return "#00c853";     // green
    if (status === "warning") return "#ffb300";  // yellow
    if (status === "danger") return "#d50000";   // red
  };

  return (
    <Card
      sx={{
        minWidth: 200,
        background: "#002B36",
        color: "white",
        borderLeft: `6px solid ${getColor()}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{title}</Typography>
          <OpacityIcon sx={{ fontSize: 35, opacity: 0.7 }} />
        </Box>

        <Typography
          variant="h3"
          sx={{ mt: 1, fontWeight: "bold", color: "#80e4ff" }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default WaterCard;
