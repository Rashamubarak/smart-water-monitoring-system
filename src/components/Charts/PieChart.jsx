// rfce
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// colors for safe & unsafe
const COLORS = ["#00C49F", "#FF4F4F"];

function PieChartComponent({ readings }) {

  // Function to check if a reading is safe
  const isSafe = (r) => {
    const phSafe = r.ph >= 6.5 && r.ph <= 8.5;
    const tdsSafe = r.tds <= 500;
    const turbSafe = r.turbidity <= 1;
    return phSafe && tdsSafe && turbSafe;
  };

  // Compute safe vs unsafe values
  const chartData = useMemo(() => {
    if (!readings || readings.length === 0) {
      return [
        { name: "Safe", value: 0 },
        { name: "Unsafe", value: 0 }
      ];
    }

    let safeCount = 0;
    let unsafeCount = 0;

    readings.forEach(r => {
      if (isSafe(r)) safeCount++;
      else unsafeCount++;
    });

    return [
      { name: "Safe", value: safeCount },
      { name: "Unsafe", value: unsafeCount }
    ];
  }, [readings]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            outerRadius={110}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
