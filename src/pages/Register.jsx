// rfce
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(""); // optional (not saved in backend yet)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: fullName,
        email,
        password,
        role: "admin" // or "user"
      });

      setSnackMsg("Registration successful!");
      setOpenSnack(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setSnackMsg(
        error.response?.data?.message || "Registration failed"
      );
      setOpenSnack(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url("https://wallpaperaccess.com/full/731608.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
        }}
      />

      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 350,
          borderRadius: "14px",
          background: "rgba(255,255,255,0.9)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Typography variant="h4" textAlign="center" mb={2}>
          Smart Water System
        </Typography>

        <Typography variant="h6" textAlign="center" mb={3}>
          Register
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField
            label="Full Name"
            fullWidth
            sx={{ mb: 2 }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <TextField
            label="Phone Number"
            fullWidth
            sx={{ mb: 2 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
        </form>

        <Typography mt={2} textAlign="center">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#0a9396", fontWeight: "bold" }}>
            Login
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => setOpenSnack(false)}
        message={snackMsg}
      />
    </Box>
  );
}

export default Register;
