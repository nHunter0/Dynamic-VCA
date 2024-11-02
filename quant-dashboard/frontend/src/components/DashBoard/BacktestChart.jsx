import React, { useEffect, useState } from "react";
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
import MetricCard from "../MetricCard";

const BacktestChart = ({ ticker = "VAS.AX" }) => {
  const [backtestData, setBacktestData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBacktestData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/backtest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticker, train_period: "5y", test_days: 30 }),
        });
        const data = await response.json();
        if (response.ok) {
          setBacktestData(data);
        } else {
          setError(data.error || "An error occurred while fetching data");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBacktestData();
  }, [ticker]);

  if (error) return <div>Error: {error}</div>;
  if (!backtestData) return <div>Loading...</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Backtest Results</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <MetricCard
          title="Mean Absolute Error"
          value={backtestData.metrics.MAE.toFixed(2)}
        />
        <MetricCard title="RMSE" value={backtestData.metrics.RMSE.toFixed(2)} />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={backtestData.comparison_df}>
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
              dataKey="actual_price"
              name="Actual Price"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="predicted_price"
              name="Predicted Price"
              stroke="#A78BFA"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BacktestChart;
