// rfce
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

// Modern color palette
const COLORS = ["#22C55E", "#EF4444"]; // Safe = Green, Unsafe = Red

function PieChartComponent({ readings }) {

  // Check if a reading is safe
  const isSafe = (r) => {
    const phSafe = r.ph >= 6.5 && r.ph <= 8.5;
    const tdsSafe = r.tds <= 500;
    const turbSafe = r.turbidity <= 1;
    return phSafe && tdsSafe && turbSafe;
  };

  // Build chart data
  const chartData = useMemo(() => {
    if (!readings || readings.length === 0) {
      return [
        { name: "Safe", value: 0 },
        { name: "Unsafe", value: 0 }
      ];
    }

    let safeCount = 0;
    let unsafeCount = 0;

    readings.forEach((r) => {
      if (isSafe(r)) safeCount++;
      else unsafeCount++;
    });

    return [
      { name: "Safe", value: safeCount },
      { name: "Unsafe", value: unsafeCount }
    ];
  }, [readings]);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  // Percentage label
  const renderLabel = ({ percent }) =>
    `${(percent * 100).toFixed(0)}%`;

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        Water Quality Status
      </h3>

      <ResponsiveContainer>
        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={115}
            paddingAngle={4}
            label={renderLabel}
            labelLine={false}
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>

          {/* Center Number */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fontWeight="600"
          >
            {total}
          </text>

          {/* Center Label */}
          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#6B7280"
          >
            Total Samples
          </text>

          <Tooltip formatter={(value, name) => [`${value}`, name]} />
          <Legend verticalAlign="bottom" />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
