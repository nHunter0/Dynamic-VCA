// src/components/Dashboard/PriceChart.jsx

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PriceChart = ({ data }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Price and Moving Averages</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.moving_averages_data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.375rem",
              }}
              labelStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              name="Price"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="SMA20"
              name="SMA20"
              stroke="#34D399"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="SMA50"
              name="SMA50"
              stroke="#F59E0B"
              strokeWidth={1}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="SMA200"
              name="SMA200"
              stroke="#EF4444"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
