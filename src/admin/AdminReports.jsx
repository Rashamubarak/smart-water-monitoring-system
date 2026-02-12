import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip
} from "@mui/material";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function AdminReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    }
  };
console.log("TOKEN:", localStorage.getItem("token"));

  // Water Safety Logic
  const getStatus = (r) => {
    if (r.ph >= 6.5 && r.ph <= 8.5 && r.tds <= 500 && r.turbidity <= 5) {
      return { label: "SAFE", color: "success" };
    }
    return { label: "UNSAFE", color: "error" };
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box sx={{ p: 4, mt: 10 }}>
          <Typography variant="h4" mb={3}>
            All User Reports
          </Typography>

          <Paper sx={{ p: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>User</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Location</b></TableCell>
                  <TableCell><b>pH</b></TableCell>
                  <TableCell><b>TDS</b></TableCell>
                  <TableCell><b>Turbidity</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {reports.map((r) => {
                  const status = getStatus(r);

                  return (
                    <TableRow key={r._id}>
                      <TableCell>{r.user?.name}</TableCell>
                      <TableCell>{r.user?.email}</TableCell>
                      <TableCell>{r.location || "N/A"}</TableCell>
                      <TableCell>{r.ph}</TableCell>
                      <TableCell>{r.tds}</TableCell>
                      <TableCell>{r.turbidity}</TableCell>

                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {reports.length === 0 && (
              <Typography sx={{ mt: 2 }}>
                No reports available.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default AdminReports;
