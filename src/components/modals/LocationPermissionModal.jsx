import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  backgroundColor: "#fff",
  borderRadius: 8,
  padding: 20,
  boxShadow: 24,
};

function LocationPermissionModal({ open, onAllow, onDeny }) {
  return (
    <Modal open={open}>
      <Box sx={style}>
        <Typography variant="h6">Location Access</Typography>

        <Typography sx={{ mt: 1 }}>
          Allow location to show water quality near you.
        </Typography>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={onDeny}>
            Don't Allow
          </Button>
          <Button variant="contained" onClick={onAllow}>
            Allow
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default LocationPermissionModal;
