// rfce
import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import WaterCard from "../components/Cards/WaterCard";
import BarChart from "../components/Charts/BarChart";
import PieChart from "../components/Charts/PieChart";
import GaugeChart from "../components/Charts/GaugeChart";
import { Box, Typography, Button } from "@mui/material";
import { getWaterData } from "../services/waterService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PaymentAlertModal from "../components/modals/PaymentAlertModal";

function Dashboard() {
  const { user, isPremium } = useContext(AuthContext);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const [loadingCharts, setLoadingCharts] = useState(true);
  const [latestReading, setLatestReading] = useState(null);
  const [readings, setReadings] = useState([]);
  const [freeTrials, setFreeTrials] = useState(3);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  // ================= TRIAL INIT (PER USER) =================
  useEffect(() => {
    if (!user?._id) return;

    const key = `freeTrials_${user._id}`;
    const stored = localStorage.getItem(key);

    if (!stored) {
      localStorage.setItem(key, "3");
      setFreeTrials(3);
    } else {
      setFreeTrials(Number(stored));
    }
  }, [user]);

  // ================= SHOW PAYMENT MODAL =================
  useEffect(() => {
    if (!isPremium && freeTrials === 0) {
      setShowPaymentAlert(true);
    } else {
      setShowPaymentAlert(false);
    }
  }, [freeTrials, isPremium]);

  // ================= LOAD WATER DATA =================
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const waterRes = await getWaterData();

        const normalized = (waterRes.data || []).map((item) => ({
          ...item,
          ph: item.ph,
          tds: item.tds,
          turbidity: item.turbidity,
          temp: item.temp
        }));

        setReadings(normalized);
        setLatestReading(normalized[0] || null);
        setLoadingCharts(false);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      }
    };

    if (isLoggedIn) loadDashboardData();
  }, [isLoggedIn]);

  // ================= STATUS =================
  const getStatus = (value, type) => {
    if (!value) return "safe";
    if (type === "ph") return value >= 6.5 && value <= 8.5 ? "safe" : "danger";
    if (type === "tds") return value <= 500 ? "safe" : value <= 900 ? "warning" : "danger";
    if (type === "turbidity") return value <= 1 ? "safe" : value <= 5 ? "warning" : "danger";
    return "safe";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <PaymentAlertModal
        open={showPaymentAlert}
        onUpgrade={() => navigate("/payment")}
      />

      {/* RIGHT SIDE */}
      <div style={{ flex: 1 }}>
        <Topbar />

        {/* MAIN CONTENT */}
        <div
          style={{
            padding: 20,
            background: "#f5f7fa",
            minHeight: "100vh",
            marginTop: 70,
          }}
        >
          <h1>Dashboard</h1>

          {!isLoggedIn && (
            <Typography align="center" color="gray">
              Please login to view water quality data.
            </Typography>
          )}

          {isLoggedIn && (
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
              <Typography>
                Free Trials Left: {isPremium ? "Unlimited" : freeTrials}
              </Typography>

              {!isPremium && (
                <Button variant="contained" onClick={() => navigate("/payment")}>
                  Upgrade
                </Button>
              )}
            </Box>
          )}

          {isLoggedIn && (
            <Box sx={{ display: "flex", gap: 3 }}>
              <WaterCard
                title="pH Level"
                value={latestReading?.ph || "--"}
                status={getStatus(latestReading?.ph, "ph")}
              />

              <WaterCard
                title="TDS (ppm)"
                value={latestReading?.tds || "--"}
                status={getStatus(latestReading?.tds, "tds")}
              />

              <WaterCard
                title="Turbidity (NTU)"
                value={latestReading?.turbidity || "--"}
                status={getStatus(latestReading?.turbidity, "turbidity")}
              />
            </Box>
          )}

          {isLoggedIn && (
            <Box sx={{ mt: 5 }}>
              {loadingCharts && (
                <Typography align="center">Loading charts...</Typography>
              )}

              {!loadingCharts && readings.length === 0 && (
                <Typography align="center">
                  No readings yet. Please add a reading.
                </Typography>
              )}

              {!loadingCharts && readings.length > 0 && (
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 2 }}>
                    <BarChart readings={readings} />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <GaugeChart reading={latestReading} />
                    <PieChart readings={readings} />
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
