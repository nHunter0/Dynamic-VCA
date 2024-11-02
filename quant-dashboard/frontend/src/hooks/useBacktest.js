// src/hooks/useBacktest.js

import { useState } from "react";

const useBacktest = () => {
  const [backtestData, setBacktestData] = useState(null);
  const [backtestLoading, setBacktestLoading] = useState(false);
  const [backtestError, setBacktestError] = useState("");

  const runBacktest = async (ticker) => {
    setBacktestLoading(true);
    setBacktestError("");
    try {
      const response = await fetch("http://localhost:5000/api/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch backtest results");
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setBacktestData(result);
    } catch (err) {
      setBacktestError(
        err.message || "Error running backtest. Please try again."
      );
    } finally {
      setBacktestLoading(false);
    }
  };

  return { backtestData, backtestLoading, backtestError, runBacktest };
};

export default useBacktest;
