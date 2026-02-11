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

  // ================= EMAIL LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      // ✅ single source of truth
      login(data.user, data.token);

      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Email login failed:", error);
      setOpenSnack(true);
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error("Google credential missing");
      }

      const data = await googleLogin(credentialResponse.credential);

      // ✅ same flow as email login
      login(data.user, data.token);

      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error("Google login failed:", error);
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
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          top: "-80px",
          left: "-80px"
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          bottom: "-60px",
          right: "-60px"
        }}
      />

      {/* Login Card */}
      <Paper
        elevation={0}
        sx={{
          width: 380,
          p: 4,
          borderRadius: "20px",
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff",
          zIndex: 2
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          LOGIN
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ opacity: 0.85 }}
        >
          Water Quality Monitoring System
        </Typography>

        {/* Email Login */}
        <form onSubmit={handleLogin}>
         <TextField
  type="email"
  fullWidth
  placeholder="Email address"
  aria-label="Email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  sx={{
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
  }}
/>


          <TextField
  type="password"
  fullWidth
  placeholder="Password"
  aria-label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  sx={{
    mb: 3,
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
  }}
/>


          <Button
            type="submit"
            fullWidth
            disabled={loading}
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Divider sx={{ my: 3, color: "#ddd" }}>OR</Divider>

        {/* Google Login */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setOpenSnack(true)}
            theme="filled_black"
            size="large"
          />
        </Box>

        <Typography
          variant="body2"
          textAlign="center"
          mt={3}
          sx={{ opacity: 0.85 }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#4fc3f7",
              fontWeight: "bold",
              textDecoration: "none"
            }}
          >
            Register
          </Link>
        </Typography>
      </Paper>

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
