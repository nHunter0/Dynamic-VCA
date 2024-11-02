// src/components/Dashboard/AIPredictionChart.jsx

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

const AIPredictionChart = ({ aiData }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        AI Predicted Prices for Next 30 Days
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="ds" stroke="#9CA3AF" />
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
              dataKey="yhat"
              name="Predicted Price"
              stroke="#A78BFA"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="yhat_lower"
              name="Lower Confidence"
              stroke="#34D399"
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="yhat_upper"
              name="Upper Confidence"
              stroke="#F59E0B"
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AIPredictionChart;
