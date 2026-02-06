import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
const style = {
  position: "fixed",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  width: 260,
  backgroundColor: "#ffffff",
  borderRadius: 10,
  padding: "12px 14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
  transition: "all 0.25s ease",

};





function CookieConsentModal({ open, onAccept, onReject }) {
  return (
    <Modal open={open}>
      <Box sx={style}>
      <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
  🍪 Cookies
</Typography>

<Typography sx={{ fontSize: "13px", color: "#666", mt: 0.5 }}>
  This site uses cookies to store login sessions.
</Typography>

<Box
  sx={{
    mt: 1,
    display: "flex",
    justifyContent: "flex-end",
    gap: 1
  }}
>
  <Button size="small" variant="text" onClick={onReject}>
    Reject
  </Button>

  <Button size="small" variant="contained" onClick={onAccept}>
    Accept
  </Button>
</Box>


      </Box>
    </Modal>
  );
}

export default CookieConsentModal;
