// rfce
import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { Box, Button, Typography, TextField, MenuItem } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

// FIX: Make sure the filename is correct → location or locations
import { states } from "../utils/location";

function Profile() {
  const { logout } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({
    fullName: "",
    phone: "",
    email: "",
    state: "",
    district: "",
    source: "",
  });

  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userData"));
    if (savedUser) setUser(savedUser);

    const savedPic = localStorage.getItem("profilePic");
    if (savedPic) setProfilePic(savedPic);
  }, []);

  const handleSave = () => {
    localStorage.setItem("userData", JSON.stringify(user));
    setEditMode(false);
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
      localStorage.setItem("profilePic", reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Profile
          </Typography>

          {/* Profile Picture */}
          <Box
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #0077b6",
              mb: 3,
            }}
          >
            <img
              src={
                profilePic ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <Button variant="contained" component="label" sx={{ mb: 3 }}>
            Change Picture
            <input hidden type="file" accept="image/*" onChange={handlePicChange} />
          </Button>

          {/* VIEW MODE */}
          {!editMode && (
            <>
              <Typography variant="h6">
                {user.fullName || "Name not set"}
              </Typography>

              <Typography>Phone: {user.phone || "Not added"}</Typography>
              <Typography>Email: {user.email || "Not added"}</Typography>
              <Typography>State: {user.state || "Not added"}</Typography>
              <Typography>District: {user.district || "Not added"}</Typography>
              <Typography>Water Source: {user.source || "Not added"}</Typography>

              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => setEditMode(true)}
              >
                Edit Details
              </Button>
            </>
          )}

          {/* EDIT MODE */}
          {editMode && (
            <>
              <TextField
                label="Full Name"
                fullWidth
                sx={{ mb: 2 }}
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              />

              <TextField
                label="Phone"
                fullWidth
                sx={{ mb: 2 }}
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />

              <TextField
                label="State"
                select
                fullWidth
                sx={{ mb: 2 }}
                value={user.state}
                onChange={(e) => setUser({ ...user, state: e.target.value })}
              >
                {Object.keys(states).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="District"
                select
                fullWidth
                sx={{ mb: 2 }}
                value={user.district}
                onChange={(e) => setUser({ ...user, district: e.target.value })}
                disabled={!user.state}
              >
                {user.state &&
                  states[user.state].map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
              </TextField>

              <TextField
                label="Water Source"
                select
                fullWidth
                sx={{ mb: 2 }}
                value={user.source}
                onChange={(e) => setUser({ ...user, source: e.target.value })}
              >
                <MenuItem value="Tap Water">Tap Water</MenuItem>
                <MenuItem value="Well Water">Well Water</MenuItem>
                <MenuItem value="Borewell">Borewell</MenuItem>
                <MenuItem value="RO Tank">RO Tank</MenuItem>
              </TextField>

              <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave}>
                Save
              </Button>

              <Button variant="outlined" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Profile;
