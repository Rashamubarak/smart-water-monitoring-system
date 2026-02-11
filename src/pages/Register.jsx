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
import api from "../services/api"; // ✅ use axios instance

function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name: fullName,
        email,
        password
      });

      setSnackMsg("Registration successful!");
      setOpenSnack(true);

      setTimeout(() => navigate("/login"), 1500);
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
        background:
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: 380,
          borderRadius: "20px",
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff"
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={1}>
          REGISTER
        </Typography>

        <Typography variant="body2" textAlign="center" mb={3} sx={{ opacity: 0.8 }}>
          Smart Water Quality Monitoring System
        </Typography>

        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            placeholder="Full Name"
            aria-label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            sx={inputStyle}
          />

          <TextField
            fullWidth
            placeholder="Phone Number"
            aria-label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={inputStyle}
          />

          <TextField
            type="email"
            fullWidth
            placeholder="Email Address"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={inputStyle}
          />

          <TextField
            type="password"
            fullWidth
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ ...inputStyle, mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: "bold",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #4fc3f7, #0288d1)",
              color: "#fff",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #0288d1, #01579b)"
              }
            }}
          >
            Register
          </Button>
        </form>

        <Typography mt={3} textAlign="center" sx={{ opacity: 0.85 }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#4fc3f7", fontWeight: "bold" }}
          >
            Login
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={openSnack}
        autoHideDuration={2500}
        onClose={() => setOpenSnack(false)}
        message={snackMsg}
      />
    </Box>
  );
}

// 🔹 shared input style
const inputStyle = {
  mb: 2.5,
  input: {
    color: "#fff",
    padding: "14px"
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    "& fieldset": { borderColor: "#aaa" },
    "&:hover fieldset": { borderColor: "#4fc3f7" },
    "&.Mui-focused fieldset": { borderColor: "#4fc3f7" }
  }
};

export default Register;
