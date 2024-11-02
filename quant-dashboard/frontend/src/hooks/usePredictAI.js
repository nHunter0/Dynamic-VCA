// src/hooks/usePredictAI.js

import { useState } from "react";

const usePredictAI = () => {
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const predictAI = async (ticker) => {
    await handlePredict(ticker, false);
  };

  const predictAdvancedAI = async (ticker) => {
    await handlePredict(ticker, true);
  };

  const handlePredict = async (ticker, advanced) => {
    setAiLoading(true);
    setAiError("");
    try {
      const endpoint = advanced ? "/api/predict-advanced" : "/api/predict";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${advanced ? "advanced " : ""}AI prediction`
        );
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setAiData(result.forecast);
    } catch (err) {
      setAiError(
        err.message ||
          `Error fetching ${
            advanced ? "advanced " : ""
          }AI prediction. Please try again.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return { aiData, aiLoading, aiError, predictAI, predictAdvancedAI };
};

export default usePredictAI;
