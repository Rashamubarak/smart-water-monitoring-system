// src/pages/Reports.jsx
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

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { getWaterData } from "../services/waterService";

function Reports() {
  const reportRef = useRef(null);

  const [readings, setReadings] = useState([]);
  const [latest, setLatest] = useState(null);
  const [user, setUser] = useState(null);

  

  // ==========================
  // Water Quality Status Logic
  // ==========================
  const getWaterStatus = (reading) => {
    if (!reading) return { label: "NO DATA", color: "#9e9e9e" };

    const { ph, tds, turbidity } = reading;

    if (ph >= 6.5 && ph <= 8.5 && tds <= 500 && turbidity <= 5) {
      return { label: "SAFE FOR DRINKING", color: "#2e7d32" };
    }

    return { label: "NOT SAFE", color: "#c62828" };
  };

  const status = getWaterStatus(latest);

  // ==========================
  // Load User + Readings
  // ==========================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    loadReadings();
  }, []);

  const loadReadings = async () => {
    try {
      const res = await getWaterData();
      setReadings(res.data);
      if (res.data.length > 0) {
        setLatest(res.data[0]);
      }
    } catch (err) {
      console.error("Failed loading readings", err);
    }
  };

  // ==========================
  // PDF DOWNLOAD
  // ==========================
  const generatePDF = async () => {
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("water-quality-report.pdf");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box sx={{ p: 4, mt: 10 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h4">Reports</Typography>
            <Button variant="contained" onClick={generatePDF}>
              Download PDF (A4)
            </Button>
          </Stack>

          <Paper
            ref={reportRef}
            sx={{
              p: 4,
              width: "794px", // A4 width
              margin: "0 auto",
              fontSize: "14px",
              color: "#000",
            }}
          >
            {/* HEADER */}
            <Box textAlign="center" mb={3}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Smart Water Quality Monitoring System
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                Official Water Quality Report
              </Typography>
            </Box>

            {/* USER INFO */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Box>
                <Typography><b>User:</b> {user?.name}</Typography>
                <Typography><b>Email:</b> {user?.email}</Typography>
              </Box>
              <Box>
                <Typography>
                  <b>Generated:</b> {new Date().toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* STATUS */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 14 }}>
                <b>Water Quality Status:</b>{" "}
                <span
                  style={{
                    backgroundColor: status.color,
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {status.label}
                </span>
              </Typography>
            </Box>

            {/* TABLE */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Reading History
            </Typography>

            {readings.length === 0 ? (
              <Typography>No readings available.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>pH</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>TDS</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Turbidity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Temp (°C)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {readings.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{r.ph}</TableCell>
                      <TableCell>{r.tds}</TableCell>
                      <TableCell>{r.turbidity}</TableCell>
                      <TableCell>{r.temp || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* SIGNATURE */}
            <Box mt={4} textAlign="right">
              <Typography>Signature: ____________________</Typography>
            </Box>

            {/* FOOTER */}
            <Box
              sx={{
                mt: 6,
                pt: 2,
                borderTop: "1px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <Typography sx={{ fontSize: 12 }}>
                Generated by Smart Water Quality Monitoring System
              </Typography>
              <Typography sx={{ fontSize: 12 }}>
                © {new Date().getFullYear()}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default Reports;
