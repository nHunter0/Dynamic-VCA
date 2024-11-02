// src/components/Dashboard/MetricsGrid.jsx

import React from "react";
import MetricCard from "../MetricCard";

const MetricsGrid = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* First Row of Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Price"
          value={data.metrics?.current_price?.toFixed(2)}
        />
        <MetricCard
          title="RSI (14)"
          value={data.metrics?.technical_metrics?.rsi?.toFixed(1)}
          colorClass={
            data.metrics?.technical_metrics?.rsi > 70
              ? "text-red-400"
              : data.metrics?.technical_metrics?.rsi < 30
              ? "text-green-400"
              : "text-white"
          }
        />
        <MetricCard
          title="Recommended Units"
          value={data.investment_recommendation?.recommended_units}
        />
        <MetricCard
          title="Recommended Amount"
          value={data.investment_recommendation?.recommended_amount?.toLocaleString(
            "en-US",
            {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }
          )}
        />
      </div>

      {/* Second Row of Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Market Scenario"
          value={data.scenario?.toUpperCase()}
          colorClass={
            data.scenario === "high" ? "text-green-400" : "text-red-400"
          }
        />
        <MetricCard
          title="Volatility"
          value={`${(
            data.metrics?.performance_metrics?.volatility * 100
          ).toFixed(2)}%`}
          colorClass={
            data.metrics?.performance_metrics?.volatility > 0.2
              ? "text-red-400"
              : "text-green-400"
          }
        />
        <MetricCard
          title="Remaining Target"
          value={data.investment_recommendation?.remaining_target?.toLocaleString(
            "en-US",
            {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }
          )}
        />
        <MetricCard
          title="Position Multiplier"
          value={data.investment_recommendation?.allocation_multiplier?.toFixed(
            2
          )}
          suffix="x"
        />
      </div>
    </div>
  );
};

export default MetricsGrid;
