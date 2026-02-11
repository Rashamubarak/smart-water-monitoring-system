import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const Payment = () => {

  const handlePayNow = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/stripe/create-checkout-session"
      );

      window.location.href = res.data.url;

    } catch (error) {
      console.log(error);
      alert("Stripe payment failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f2027, #07779d, #2c5364)"
      }}
    >
      <Card sx={{ maxWidth: 420, width: "100%", borderRadius: 3 }}>
        <CardContent>

          <Typography variant="h5" align="center" fontWeight="bold">
            Subscription
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" align="center">
            Monthly Plan
          </Typography>

          <Typography
            variant="h4"
            align="center"
            color="primary.main"
            fontWeight="bold"
          >
            ₹499 / month
          </Typography>

          <List>
            {[
              "Live water usage monitoring",
              "Monthly consumption reports",
              "Leakage alerts",
              "Smart dashboard access"
            ].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePayNow}
          >
            Pay Now
          </Button>

        </CardContent>
      </Card>
    </Box>
  );
};

export default Payment;
