import { Modal, Box, Typography, Button } from "@mui/material";

function PaymentAlertModal({ open, onUpgrade }) {
  return (
    <Modal open={open} disableEscapeKeyDown>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 380,
        p: 4,
        borderRadius: "18px",
        textAlign: "center",
        backdropFilter: "blur(14px)",
        background: "rgba(255,255,255,0.15)",
        color: "#fff"
      }}>
        <Typography variant="h6" mb={1}>Free Trial Ended</Typography>
        <Typography mb={3}>
          Please upgrade to continue accessing reports.
        </Typography>
        <Button fullWidth variant="contained" onClick={onUpgrade}>
          Upgrade Now
        </Button>
      </Box>
    </Modal>
  );
}

export default PaymentAlertModal;
