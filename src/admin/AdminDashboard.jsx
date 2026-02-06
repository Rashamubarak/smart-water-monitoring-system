import React from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary" mb={3}>
        System Administration Panel
      </Typography>

      <Grid container spacing={3}>

        {/* USERS CARD */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Users</Typography>
            <Typography>Total registered users</Typography>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </Button>
          </Paper>
        </Grid>

        {/* REPORTS CARD */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Reports</Typography>
            <Typography>Water usage analytics</Typography>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/reports")}
            >
              View Reports
            </Button>
          </Paper>
        </Grid>

        {/* SETTINGS CARD */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">System Settings</Typography>
            <Typography>Application configuration</Typography>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled
            >
              Coming Soon
            </Button>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}

export default AdminDashboard;
