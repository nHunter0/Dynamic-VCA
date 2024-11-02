// src/hooks/useFetchData.js

import { useState } from "react";

const useFetchData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (ticker, monthlyTarget, totalTarget) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker,
          monthly_target: monthlyTarget,
          total_target: totalTarget,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      setData(result);
    } catch (err) {
      setError(err.message || "Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default useFetchData;
