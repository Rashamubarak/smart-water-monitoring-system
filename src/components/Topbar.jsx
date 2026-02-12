import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [monitoredLocation, setMonitoredLocation] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const selected = JSON.parse(
      localStorage.getItem(`selectedLocation_${user.email}`)
    );

    setMonitoredLocation(selected);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.name || user?.fullName || "User";
  const profileImage =
    user?.profilePic || localStorage.getItem("profilePic") || "";

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
        ml: "240px",
        backgroundColor: "#112240",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.3)"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* LEFT */}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Smart Water Monitoring System
        </Typography>

        {/* CENTER - Monitored Location */}
        {monitoredLocation && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon sx={{ color: "#4fc3f7" }} />
            <Typography sx={{ fontWeight: 500 }}>
              {monitoredLocation.locationName === "Current Location"
                ? `Current (${monitoredLocation.district})`
                : `${monitoredLocation.locationName} (${monitoredLocation.stateName})`}
            </Typography>
          </Box>
        )}

        {/* RIGHT */}
        {!user ? (
          <IconButton onClick={() => navigate("/login")} sx={{ color: "#fff" }}>
            <LoginIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontWeight: 500 }}>
              {userName}
            </Typography>

            <Avatar
              src={profileImage}
              sx={{ bgcolor: "#4fc3f7" }}
            >
              {userName[0]}
            </Avatar>

            <IconButton onClick={handleLogout} sx={{ color: "#ff6b6b" }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
