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
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("water-report.pdf");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box sx={{ p: 4, mt: 10 }}>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h4">Reports</Typography>

            <Button variant="contained" onClick={generatePDF}>
              Download PDF (A4)
            </Button>
          </Stack>

          <Paper ref={reportRef} sx={{ p: 3 }}>

            {/* HEADER */}
            <Box textAlign="center" mb={2}>
              <Typography variant="h5">
                Smart Water Monitoring System
              </Typography>
              <Typography>Official Water Quality Report</Typography>
            </Box>

            {/* USER INFO */}
            <Box sx={{ display: "flex", gap: 5, mb: 3 }}>
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

            {/* LATEST */}
            <Typography variant="h6">Latest Reading</Typography>

            {latest ? (
              <Box sx={{ display: "flex", gap: 3, mb: 3 }}>

                <Paper sx={{ p: 2 }}>
                  <Typography>pH</Typography>
                  <Typography>{latest.ph}</Typography>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography>TDS</Typography>
                  <Typography>{latest.tds}</Typography>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography>Turbidity</Typography>
                  <Typography>{latest.turbidity}</Typography>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography>Temp</Typography>
                  <Typography>{latest.temp || "-"}</Typography>
                </Paper>

              </Box>
            ) : (
              <Typography>No readings yet.</Typography>
            )}

            {/* HISTORY */}
            <Typography variant="h6">Reading History</Typography>

            {readings.length === 0 ? (
              <Typography>No readings yet.</Typography>
            ) : (
              <Table size="small">

                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>pH</TableCell>
                    <TableCell>TDS</TableCell>
                    <TableCell>Turbidity</TableCell>
                    <TableCell>Temp</TableCell>
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

            <Box mt={4} textAlign="right">
              <Typography>
                Signature: ____________________
              </Typography>
            </Box>

          </Paper>

        </Box>
      </Box>
    </div>
  );
}

export default Reports;
