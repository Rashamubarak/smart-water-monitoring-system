// rfce
import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import WarningIcon from "@mui/icons-material/Warning";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import QuizIcon from "@mui/icons-material/Quiz";

const sidebarColor = "#0a192f";
const activeColor = "#112240";
const iconActive = "#64ffda";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Select Location", icon: <LocationOnIcon />, path: "/select-location" },
    { text: "Add Location", icon: <AddLocationIcon />, path: "/add-location" },
    { text: "Alerts", icon: <WarningIcon />, path: "/alerts" },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "Add Reading", icon: <AddCircleIcon />, path: "/add-reading" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
    { text: "Questionnaire", icon: <QuizIcon/>, path: "/questionnaire" }

  ];

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          backgroundColor: sidebarColor,
          color: "#fff",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        },
      }}
    >
      {/* Logo / Title */}
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid #112240" }}>
        <Typography variant="h6" sx={{ color: "#64ffda" }}>
          WATER SYSTEM
        </Typography>
      </Box>

      {/* MENU */}
      <Box sx={{ flex: 1, overflowY: "auto", mt: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={isActive}
                sx={{
                  backgroundColor: isActive ? activeColor : "transparent",
                  transition: "0.3s",
                  borderRadius: "4px",
                  mx: 1,
                  "&:hover": { backgroundColor: activeColor }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? iconActive : "#fff" }}>
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{ color: isActive ? iconActive : "#fff" }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* LOGOUT */}
      <Box sx={{ borderTop: "1px solid #112240" }}>
        <List>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: "#ff6b6b",
              "&:hover": { backgroundColor: activeColor },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#ff6b6b" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
