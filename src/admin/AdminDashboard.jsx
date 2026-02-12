import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ✅ use your axios instance

function AdminDashboard() {
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReports, setTotalReports] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
  try {
    const usersRes = await api.get("/admin/users/count");
    setTotalUsers(usersRes.data.count || 0);

    const reportsRes = await api.get("/admin/reports/count");
    setTotalReports(reportsRes.data.count || 0);

  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
  }
};



  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary" mb={3}>
        System Administration Panel
      </Typography>

      {/* 🔥 Stats Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography color="text.secondary">
              Total Users
            </Typography>
            <Typography variant="h5" fontWeight="600">
              {totalUsers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography color="text.secondary">
              Total Reports
            </Typography>
            <Typography variant="h5" fontWeight="600">
              {totalReports}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Existing Feature Cards */}
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
             onClick={() => navigate("/admin/reports")}

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
