// src/components/Dashboard/MetricCard.jsx

import React from "react";

const MetricCard = ({
  title,
  value,
  trend = null,
  suffix = "",
  colorClass = "text-blue-400",
}) => (
  <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all">
    <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-bold ${colorClass}`}>
        {value}
        {suffix}
      </span>
      {trend !== null && (
        <span
          className={`text-sm font-medium ${
            trend >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {trend > 0 ? "+" : ""}
          {trend.toFixed(2)}%
        </span>
      )}
    </div>
  </div>
);

export default MetricCard;
