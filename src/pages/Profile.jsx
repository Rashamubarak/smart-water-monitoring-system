// rfce
import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Avatar,
} from "@mui/material";

import { AuthContext } from "../context/AuthContext";
import { states } from "../utils/location";

function Profile() {
  const { user } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);

  const [details, setDetails] = useState({
    phone: "",
    state: "",
    district: "",
    source: "",
  });

  // ================================
  // LOAD PROFILE (PER USER)
  // ================================
  useEffect(() => {
    if (!user?.email) return;

    const saved = localStorage.getItem(
      `profileDetails_${user.email}`
    );

    if (saved) {
      setDetails(JSON.parse(saved));
    }
  }, [user]);

  // ================================
  // SAVE PROFILE (PER USER)
  // ================================
  const handleSave = () => {
    if (!user?.email) return;

    localStorage.setItem(
      `profileDetails_${user.email}`,
      JSON.stringify(details)
    );

    setEditMode(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Profile
          </Typography>

          {/* AVATAR */}
          <Avatar
            src={user?.profilePic || ""}
            alt={user?.name}
            sx={{
              width: 140,
              height: 140,
              border: "3px solid #1976d2",
              mb: 2,
            }}
          >
            {!user?.profilePic && user?.name?.charAt(0)}
          </Avatar>

          {/* VIEW MODE */}
          {!editMode && (
            <>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography>Email: {user?.email}</Typography>
              <Typography>Phone: {details.phone || "Not added"}</Typography>
              <Typography>State: {details.state || "Not added"}</Typography>
              <Typography>
                District: {details.district || "Not added"}
              </Typography>
              <Typography>
                Water Source: {details.source || "Not added"}
              </Typography>

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
                label="Phone"
                fullWidth
                sx={{ mb: 2 }}
                value={details.phone}
                onChange={(e) =>
                  setDetails({ ...details, phone: e.target.value })
                }
              />

              <TextField
                label="State"
                select
                fullWidth
                sx={{ mb: 2 }}
                value={details.state}
                onChange={(e) =>
                  setDetails({
                    ...details,
                    state: e.target.value,
                    district: "",
                  })
                }
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
                disabled={!details.state}
                value={details.district}
                onChange={(e) =>
                  setDetails({ ...details, district: e.target.value })
                }
              >
                {details.state &&
                  states[details.state].map((d) => (
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
                value={details.source}
                onChange={(e) =>
                  setDetails({ ...details, source: e.target.value })
                }
              >
                <MenuItem value="Tap Water">Tap Water</MenuItem>
                <MenuItem value="Well Water">Well Water</MenuItem>
                <MenuItem value="Borewell">Borewell</MenuItem>
                <MenuItem value="RO Tank">RO Tank</MenuItem>
              </TextField>

              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                variant="outlined"
                onClick={() => setEditMode(false)}
              >
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
