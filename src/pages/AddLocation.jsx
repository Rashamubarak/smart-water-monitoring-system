// rfce
import React, { useState } from 'react'
import {
  Box, TextField, Button, MenuItem,
  Paper, Typography, Snackbar
} from '@mui/material'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { states } from '../utils/location'

function AddLocation() {
  const [locationName, setLocationName] = useState("")
  const [stateName, setStateName] = useState("")
  const [district, setDistrict] = useState("")
  const [sourceType, setSourceType] = useState("")
  const [address, setAddress] = useState("")
  const [openSnack, setOpenSnack] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get logged-in user
    const email = localStorage.getItem("user");
    if (!email) {
      navigate("/login");
      return;
    }

    // Load ONLY this user's saved locations
    const existingLocations =
      JSON.parse(localStorage.getItem(`locations_${email}`)) || [];

    // create new object
    const newLocation = {
      locationName,
      stateName,
      district,
      sourceType,
      address,
    };

    // save back to LS for THIS USER ONLY
    localStorage.setItem(
      `locations_${email}`,
      JSON.stringify([...existingLocations, newLocation])
    );

    setOpenSnack(true);

    // reset fields
    setLocationName("");
    setStateName("");
    setDistrict("");
    setSourceType("");
    setAddress("");

    // redirect
    setTimeout(() => {
      navigate("/select-location");
    }, 1000);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 4 }}>
        <Paper sx={{ p: 4, width: "50%" }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Add Water Location
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label='Location Name'
              fullWidth
              sx={{ mb: 2 }}
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />

            <TextField
              select
              label="Select State"
              fullWidth
              sx={{ mb: 2 }}
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              required
            >
              {Object.keys(states).map((s, i) => (
                <MenuItem key={i} value={s}>{s}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Select District"
              fullWidth
              sx={{ mb: 2 }}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              disabled={!stateName}
            >
              {stateName &&
                states[stateName].map((d, i) => (
                  <MenuItem key={i} value={d}>{d}</MenuItem>
                ))}
            </TextField>

            <TextField
              select
              label="Source Type"
              fullWidth
              sx={{ mb: 2 }}
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              required
            >
              <MenuItem value="Tap Water">Tap Water</MenuItem>
              <MenuItem value="Well Water">Well Water</MenuItem>
              <MenuItem value="Borewell">Borewell</MenuItem>
              <MenuItem value="RO Tank">RO Tank</MenuItem>
            </TextField>

            <TextField
              label='Address'
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 2 }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Button type='submit' variant='contained'>
              Save Location
            </Button>
          </form>
        </Paper>

        <Snackbar
          open={openSnack}
          autoHideDuration={2000}
          onClose={() => setOpenSnack(false)}
          message="Location added successfully!"
        />
      </Box>
    </div>
  )
}

export default AddLocation
