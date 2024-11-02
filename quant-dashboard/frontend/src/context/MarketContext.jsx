// src/context/MarketContext.jsx

import React, { createContext, useContext, useState } from "react";

const MarketContext = createContext();

export const useMarketContext = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarketContext must be used within a MarketProvider");
  }
  return context;
};

export const MarketProvider = ({ children }) => {
  // State management
  const [ticker, setTicker] = useState("VAS.AX");
  const [monthlyTarget, setMonthlyTarget] = useState(2000);
  const [totalTarget, setTotalTarget] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [backtestData, setBacktestData] = useState(null);
  const [backtestLoading, setBacktestLoading] = useState(false);
  const [backtestError, setBacktestError] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);

  const fetchData = async (selectedTicker = ticker) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: selectedTicker,
          monthly_target: monthlyTarget,
          total_target: totalTarget,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch market data");
      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setData(result);
      setAiData(null);
      setBacktestData(null);
      setSelectedModel(null);
    } catch (err) {
      setError(err.message || "Error fetching market data");
    } finally {
      setLoading(false);
    }
  };

  const handlePredictWithAI = async (advanced = false) => {
    setAiLoading(true);
    setAiError("");
    setBacktestData(null);
    try {
      const endpoint = advanced ? "/api/predict-advanced" : "/api/predict";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI prediction");
      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setAiData(result);
      setSelectedModel(advanced ? "Advanced LSTM" : "Prophet");
    } catch (err) {
      setAiError(err.message || "Error generating AI prediction");
    } finally {
      setAiLoading(false);
    }
  };

  const handleBacktest = async () => {
    if (!aiData) {
      setBacktestError("Please run AI prediction first");
      return;
    }

    setBacktestLoading(true);
    setBacktestError("");
    try {
      const response = await fetch("http://localhost:5000/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) throw new Error("Failed to fetch backtest results");
      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setBacktestData(result);
    } catch (err) {
      setBacktestError(err.message || "Error running backtest");
    } finally {
      setBacktestLoading(false);
    }
  };

  const value = {
    ticker,
    setTicker,
    monthlyTarget,
    setMonthlyTarget,
    totalTarget,
    setTotalTarget,
    loading,
    data,
    error,
    aiData,
    aiLoading,
    aiError,
    backtestData,
    backtestLoading,
    backtestError,
    selectedModel,
    fetchData,
    handlePredictWithAI,
    handleBacktest,
  };

  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
};
