// rfce
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function BarChartComponent({ readings, darkMode = false }) {

  // Convert readings
 const chartData = useMemo(() => {
  if (!readings || readings.length === 0) return [];

  return readings.map((r, index) => {
    const dateObj = new Date(r.createdAt || r.date);

    return {
      date: isNaN(dateObj)
        ? `Reading ${index + 1}`
        : dateObj.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          }),
      ph: Number(r.ph),
      tds: Number(r.tds),
      turbidity: Number(r.turbidity)
    };
  });
}, [readings]);


  const textColor = darkMode ? "#E5E7EB" : "#374151";
  const gridColor = darkMode ? "#374151" : "#E5E7EB";
  const tooltipBg = darkMode ? "#1F2937" : "#FFFFFF";

  return (
    <div style={{ width: "100%", height: 420 }}>
      <h3 style={{ textAlign: "center", color: textColor }}>
        Water Quality Readings
      </h3>

      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >

          {/* Gradients */}
          <defs>
            <linearGradient id="phBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            <linearGradient id="tdsBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="turbBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />

          {/* Axes */}
          <XAxis dataKey="date" tick={{ fill: textColor }} />
          <YAxis tick={{ fill: textColor }} />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderRadius: "8px",
              border: "none",
              color: textColor
            }}
          />

          {/* Legend */}
          <Legend />

          {/* Bars */}
          <Bar dataKey="ph" fill="url(#phBar)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="tds" fill="url(#tdsBar)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="turbidity" fill="url(#turbBar)" radius={[6, 6, 0, 0]} />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;
