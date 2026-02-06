// rfce
import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Divider
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { AuthContext } from "../context/AuthContext";
import { loginUser, googleLogin } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ==========================
  // EMAIL + PASSWORD LOGIN
  // ==========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    const data = await loginUser({ email, password });

localStorage.setItem("token", data.token);   // ✅ SAVE TOKEN

login(data.user);
navigate("/");

    } catch (error) {
      console.error("Email login failed:", error);
      setOpenSnack(true);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // GOOGLE LOGIN
  // ==========================
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse?.credential;

      if (!token) {
        throw new Error("No Google credential received");
      }

      const res = await googleLogin(token);

localStorage.setItem("token", res.data.token);   // ✅ SAVE TOKEN

login(res.data.user);
navigate("/");

    } catch (error) {
      console.error("Google login failed:", error);
      setOpenSnack(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          'url("https://wallpaperaccess.com/full/731608.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
        }}
      />

      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 360,
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
          Login
        </Typography>

        {/* EMAIL LOGIN */}
        <form onSubmit={handleLogin}>
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>OR</Divider>

        {/* GOOGLE LOGIN */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setOpenSnack(true)}
            useOneTap={false}
            theme="outline"
            size="large"
          />
        </Box>

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ fontWeight: "bold" }}>
            Register
          </Link>
        </Typography>
      </Paper>

      {/* ERROR SNACKBAR */}
      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={() => setOpenSnack(false)}
        message="Login failed. Please try again."
      />
    </Box>
  );
}

export default Login;
