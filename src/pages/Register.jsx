// rfce
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // create full user object
    const userData = {
      fullName,
      phone,
      email,
      password,
    };

    // save to LS
    localStorage.setItem("userData", JSON.stringify(userData));

    // login automatically
    localStorage.setItem("user", email);

    // redirect to dashboard
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url("https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1740&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* overlay */}
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
        <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
          Smart Water System
        </Typography>

        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
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
            required
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

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#0a9396", fontWeight: "bold" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
