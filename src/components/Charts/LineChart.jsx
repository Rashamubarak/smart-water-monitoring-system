// rfce
import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function LineChartComponent({ readings }) {

  // Convert readings into chart-friendly format
  const chartData = readings.map(r => ({
    date: r.date,
    ph: parseFloat(r.ph)
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <Line
            type='monotone'
            dataKey='ph'
            stroke='#0099ff'
            strokeWidth={3}
          />
          <CartesianGrid stroke='#ccc' />
          <XAxis dataKey='date' />
          <YAxis domain={[0, 14]} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartComponent;
