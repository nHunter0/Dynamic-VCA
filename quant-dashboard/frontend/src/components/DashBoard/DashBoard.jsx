import React, { useState, useEffect } from "react";
import Header from "./Header";
import MetricsGrid from "./MetricsGrid";
import PriceChart from "./PriceChart";
import AIPredictionChart from "./AIPredictionChart";
import BacktestChart from "./BacktestChart";
import AnalysisSummary from "./AnalysisSummary";
import { Activity, AlertCircle, Brain, History, Info } from "lucide-react";

const Dashboard = () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  const renderAnalysisStatus = () => {
    if (!data) return null;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Analysis Status</h3>
          </div>
          {selectedModel && (
            <span className="px-3 py-1 bg-blue-900 rounded-full text-sm">
              Model: {selectedModel}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Market Analysis</p>
            <p className="text-green-400">✓ Complete</p>
          </div>
          <div>
            <p className="text-gray-400">AI Prediction</p>
            {aiData ? (
              <p className="text-green-400">✓ Generated</p>
            ) : (
              <p className="text-yellow-400">○ Pending</p>
            )}
          </div>
          <div>
            <p className="text-gray-400">Backtest Results</p>
            {backtestData ? (
              <p className="text-green-400">✓ Validated</p>
            ) : (
              <p className="text-yellow-400">○ Pending</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header
          ticker={ticker}
          setTicker={setTicker}
          monthlyTarget={monthlyTarget}
          setMonthlyTarget={setMonthlyTarget}
          totalTarget={totalTarget}
          setTotalTarget={setTotalTarget}
          fetchData={fetchData}
        />

        {/* Action Buttons */}
        {data && (
          <div className="flex flex-wrap justify-center md:justify-end mt-4 space-x-4">
            <button
              onClick={() => handlePredictWithAI(false)}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              disabled={aiLoading}
            >
              <Activity className="w-5 h-5" />
              Prophet Model
            </button>
            <button
              onClick={() => handlePredictWithAI(true)}
              className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              disabled={aiLoading}
            >
              <Brain className="w-5 h-5" />
              LSTM Model
            </button>
            {/* Disable Backtest for now. 
            {aiData && (
              <button
                onClick={handleBacktest}
                className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
                disabled={backtestLoading}
              >
                <History className="w-5 h-5" />
                5Y Backtest
              </button>
            )} */}
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}
        {aiError && (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{aiError}</span>
          </div>
        )}
        {backtestError && (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{backtestError}</span>
          </div>
        )}

        {/* Loading States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-400">Loading market data...</p>
          </div>
        )}
        {aiLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-400">Generating AI prediction...</p>
          </div>
        )}
        {backtestLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
            <p className="mt-2 text-gray-400">Running 5Y backtest...</p>
          </div>
        )}

        {/* Main Content */}
        {data && (
          <>
            {renderAnalysisStatus()}
            <MetricsGrid data={data} />

            {/* Charts */}
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PriceChart data={data} />
                {aiData && <AIPredictionChart aiData={aiData.forecast} />}
                {backtestData && <BacktestChart backtestData={backtestData} />}
              </div>
            </div>

            {/* Analysis Summary */}
            {aiData && aiData.summary && (
              <div className="space-y-6 mt-6">
                {/* Market Overview and Recommendations */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold">
                        Trading Analysis Dashboard
                      </h3>
                    </div>
                    <div className="px-3 py-1 bg-blue-900/50 rounded-full text-sm">
                      {selectedModel || "Analysis"} Results
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* VCA Analysis */}
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <h4 className="text-gray-300 font-medium mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> VCA Analysis
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Recommended Investment
                          </p>
                          <p className="text-xl font-bold text-green-400">
                            $
                            {data.investment_recommendation.recommended_amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Units to Purchase
                          </p>
                          <p className="text-lg">
                            {data.investment_recommendation.recommended_units}{" "}
                            units
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Market Scenario
                          </p>
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              data.scenario === "high"
                                ? "bg-green-900/50 text-green-100"
                                : "bg-red-900/50 text-red-100"
                            }`}
                          >
                            {data.scenario.toUpperCase()} VOLATILITY
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Prediction */}
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <h4 className="text-gray-300 font-medium mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" /> AI Prediction
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Current Price
                          </p>
                          <p className="text-xl font-bold">
                            ${data.metrics.current_price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Predicted Price
                          </p>
                          <p className="text-lg">
                            $
                            {aiData.forecast[
                              aiData.forecast.length - 1
                            ].yhat.toFixed(2)}
                          </p>
                        </div>
                        {backtestData && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">
                              Model Accuracy
                            </p>
                            <p className="text-lg">
                              {(100 - backtestData.metrics.MAPE).toFixed(1)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Combined Recommendation */}
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <h4 className="text-gray-300 font-medium mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Final Recommendation
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Technical Indicators
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-gray-800/50 p-2 rounded">
                              RSI:{" "}
                              {data.metrics.technical_metrics.rsi.toFixed(1)}
                            </div>
                            <div className="bg-gray-800/50 p-2 rounded">
                              Vol:{" "}
                              {(
                                data.metrics.performance_metrics.volatility *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            Position Sizing
                          </p>
                          <p className="text-lg">
                            {data.investment_recommendation.allocation_multiplier.toFixed(
                              2
                            )}
                            x multiplier
                          </p>
                        </div>
                        <div className="mt-2">
                          <div
                            className={`p-2 rounded text-center font-medium ${
                              data.scenario === "high" &&
                              data.metrics.technical_metrics.rsi < 70
                                ? "bg-green-900/50 text-green-100"
                                : data.scenario === "low" &&
                                  data.metrics.technical_metrics.rsi > 30
                                ? "bg-yellow-900/50 text-yellow-100"
                                : "bg-red-900/50 text-red-100"
                            }`}
                          >
                            {data.scenario === "high" &&
                            data.metrics.technical_metrics.rsi < 70
                              ? "✓ ACCUMULATE"
                              : data.scenario === "low" &&
                                data.metrics.technical_metrics.rsi > 30
                              ? "⚠ MONITOR"
                              : "✗ HOLD"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Warning and Additional Info */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3">
                      <h5 className="font-medium mb-1 text-red-400">
                        Risk Management
                      </h5>
                      <ul className="list-disc list-inside text-gray-300">
                        <li>
                          Stop Loss: $
                          {(data.metrics.current_price * 0.95).toFixed(2)} (-5%)
                        </li>
                        {data.metrics.performance_metrics.volatility > 0.2 && (
                          <li>
                            High volatility detected - Consider smaller position
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-3">
                      <h5 className="font-medium mb-1 text-blue-400">
                        Strategy Notes
                      </h5>
                      <ul className="list-disc list-inside text-gray-300">
                        <li>
                          Market Trend:{" "}
                          {data.scenario === "high" ? "Bullish" : "Bearish"}
                        </li>
                        <li>
                          AI Confidence:{" "}
                          {backtestData ? "High" : "Pending Validation"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
