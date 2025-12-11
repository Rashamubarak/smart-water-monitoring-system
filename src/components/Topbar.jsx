// rfce
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userData"));
    if (savedUser) setUser(savedUser);

    const pic = localStorage.getItem("profilePic");
    if (pic) setProfilePic(pic);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
        ml: "240px",
        backgroundColor: "#112240",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.2)"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Left - page title placeholder */}
        <Typography variant="h6">
          Smart Water Monitoring System
        </Typography>

        {/* Right - user info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography>{user.fullName || "User"}</Typography>

          <Avatar
            src={
              profilePic ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
          />

          <IconButton onClick={handleLogout} sx={{ color: "#ff6b6b" }}>
            <LogoutIcon />
          </IconButton>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
