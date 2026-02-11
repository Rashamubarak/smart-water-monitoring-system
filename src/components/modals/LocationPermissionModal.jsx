import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320, // smaller width
  padding: 3,
  borderRadius: "16px",
  backdropFilter: "blur(15px)",
  background: "rgba(255, 255, 255, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  color: "#fff",
};

function LocationPermissionModal({ open, onAllow, onDeny }) {
  return (
    <Modal open={open}>
      <Box sx={style}>
        <Typography variant="subtitle1" fontWeight="600">
          Location Access
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
          Allow location to show water quality near you.
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={onDeny}
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.5)",
            }}
          >
            Don't Allow
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={onAllow}
            sx={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(5px)",
              color: "#fff",
              "&:hover": {
                background: "rgba(82, 132, 239, 0.35)",
              },
            }}
          >
            Allow
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default LocationPermissionModal;
