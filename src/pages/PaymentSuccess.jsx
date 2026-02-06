import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Mark user as premium
    localStorage.setItem("isPremium", "true");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        textAlign: "center"
      }}
    >
      <h1>🎉 Payment Successful</h1>
      <p>Premium Activated Successfully</p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "12px 30px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#4CAF50",
          color: "white",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;
