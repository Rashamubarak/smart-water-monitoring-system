// src/pages/Reports.jsx
// rfce
import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  getAlertsForReading,
  getRecommendations,
  getWHOComparison,
  monthlySummary,
} from "../utils/analyzeWater";

function Reports() {
  const navigate = useNavigate();
  const reportRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [readings, setReadings] = useState([]);
  const [latest, setLatest] = useState(null);
  const [monthStats, setMonthStats] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("user");
    if (!email) {
      navigate("/login");
      return;
    }
    const u = JSON.parse(localStorage.getItem("userData"));
    setUserData(u || { email });

    const arr = JSON.parse(localStorage.getItem(`readings_${email}`)) || [];
    setReadings(arr);
    setLatest(arr.length ? arr[0] : null);

    // compute for current month
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setMonthStats(monthlySummary(arr, monthKey));
  }, [navigate]);

  const generateA4PDF = async () => {
    if (!reportRef.current) return;
    const doc = new jsPDF("p", "mm", "a4");
    // capture as canvas
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // calculate image size to fit A4
    const imgWidth = 210; // mm A4 width
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    // if content longer than one page, add pages (simple split)
    if (imgHeight > pageHeight) {
      let remaining = imgHeight - pageHeight;
      while (remaining > 0) {
        position = - (pageHeight * ( (imgHeight - remaining) / imgHeight ));
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        remaining -= pageHeight;
      }
    }

    const fname = `WaterReport_${userData?.email || "user"}_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(fname);
  };

  const renderStatus = (r) => {
    const alerts = getAlertsForReading(r);
    if (!alerts || alerts.length === 0) return { text: "Safe", color: "green" };
    // if any error, mark unsafe
    const hasError = alerts.some((a) => a.type === "error");
    return { text: hasError ? "Unsafe" : "Warning", color: hasError ? "red" : "orange" };
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box sx={{ p: 4, mt: 10 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h4">Reports</Typography>

            <Box>
              <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate("/add-reading")}>
                Add Reading
              </Button>

              <Button variant="contained" onClick={generateA4PDF}>
                Download PDF (A4)
              </Button>
            </Box>
          </Stack>

          {/* This is the printable report area */}
          <Paper ref={reportRef} sx={{ p: 3 }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="h5">Smart Water Monitoring System</Typography>
              <Typography variant="body2">Official Water Quality Report</Typography>
            </Box>

            {/* User & Location details */}
            <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography><strong>User:</strong> {userData?.fullName || userData?.email}</Typography>
                <Typography><strong>Email:</strong> {userData?.email}</Typography>
                <Typography><strong>Phone:</strong> {userData?.phone || "-"}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography><strong>Location:</strong> {userData?.state || "-"} , {userData?.district || "-"}</Typography>
                <Typography><strong>Source:</strong> {userData?.source || "-"}</Typography>
                <Typography><strong>Generated:</strong> {new Date().toLocaleString()}</Typography>
              </Box>
            </Box>

            {/* Latest reading summary */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Latest Reading</Typography>
              {latest ? (
                <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                  <Paper sx={{ p: 2, minWidth: 140 }}>
                    <Typography>pH</Typography>
                    <Typography variant="h6">{latest.ph}</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, minWidth: 140 }}>
                    <Typography>TDS (ppm)</Typography>
                    <Typography variant="h6">{latest.tds}</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, minWidth: 140 }}>
                    <Typography>Turbidity (NTU)</Typography>
                    <Typography variant="h6">{latest.turbidity}</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, minWidth: 140 }}>
                    <Typography>Temp (°C)</Typography>
                    <Typography variant="h6">{latest.temp || "-"}</Typography>
                  </Paper>

                  <Paper sx={{ p: 2, minWidth: 160 }}>
                    <Typography>Status</Typography>
                    <Box sx={{ mt: 1 }}>
                      {(() => {
                        const st = renderStatus(latest);
                        return (
                          <Typography sx={{ color: st.color, fontWeight: "bold" }}>
                            {st.text}
                          </Typography>
                        );
                      })()}
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Typography>No readings yet. Add a reading first.</Typography>
              )}
            </Box>

            {/* Monthly summary */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Monthly Summary (this month)</Typography>
              {monthStats ? (
                <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography>Samples</Typography>
                    <Typography variant="h6">{monthStats.count}</Typography>
                  </Paper>
                  <Paper sx={{ p: 2 }}>
                    <Typography>Avg pH</Typography>
                    <Typography variant="h6">{monthStats.avgPh}</Typography>
                  </Paper>
                  <Paper sx={{ p: 2 }}>
                    <Typography>Avg TDS</Typography>
                    <Typography variant="h6">{monthStats.avgTds}</Typography>
                  </Paper>
                  <Paper sx={{ p: 2 }}>
                    <Typography>Avg Turbidity</Typography>
                    <Typography variant="h6">{monthStats.avgTurbidity}</Typography>
                  </Paper>
                </Box>
              ) : (
                <Typography>No data for this month.</Typography>
              )}
            </Box>

            {/* History table */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Reading History</Typography>
              {readings.length === 0 ? (
                <Typography sx={{ mt: 1 }}>No readings yet.</Typography>
              ) : (
                <Table size="small" sx={{ mt: 1 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>pH</TableCell>
                      <TableCell>TDS</TableCell>
                      <TableCell>Turbidity</TableCell>
                      <TableCell>Temp</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {readings.map((r, idx) => {
                      const st = renderStatus(r);
                      return (
                        <TableRow key={idx}>
                          <TableCell>{r.date}</TableCell>
                          <TableCell>{r.ph}</TableCell>
                          <TableCell>{r.tds}</TableCell>
                          <TableCell>{r.turbidity}</TableCell>
                          <TableCell>{r.temp || "-"}</TableCell>
                          <TableCell sx={{ color: st.color }}>{st.text}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Box>

            {/* Recommendations & WHO comparison */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Recommendations</Typography>
              {latest ? (
                <>
                  {getRecommendations(latest).map((r, i) => (
                    <Typography key={i}>• {r}</Typography>
                  ))}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">WHO Comparison</Typography>
                    {getWHOComparison(latest).map((w, i) => (
                      <Typography key={i}>
                        {w.label}: {w.value} | Safe Range: {w.safeRange} →{" "}
                        <strong style={{ color: w.status === "Safe" ? "green" : "red" }}>
                          {w.status}
                        </strong>
                      </Typography>
                    ))}
                  </Box>
                </>
              ) : (
                <Typography>No recommendations — no readings.</Typography>
              )}
            </Box>

            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Typography>Signature: ____________________</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default Reports;
