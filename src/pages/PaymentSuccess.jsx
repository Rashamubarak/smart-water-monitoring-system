import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { setIsPremium } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem("isPremium", "true");
    localStorage.removeItem("freeTrials");
    setIsPremium(true);

    const timer = setTimeout(() => navigate("/"), 2000);
    return () => clearTimeout(timer);
  }, [navigate, setIsPremium]);

  return <h2 style={{textAlign:"center"}}>Payment Successful</h2>;
};

export default PaymentSuccess;
