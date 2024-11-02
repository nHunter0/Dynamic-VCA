import React, { useState } from "react";
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
import { TrendingUp, ChevronDown, Search, AlertCircle } from "lucide-react";

const STOCK_OPTIONS = [
  {
    value: "VAS.AX",
    label: "VAS - Vanguard Australian Shares",
    description: "Vanguard Australian Shares Index ETF",
  },
  {
    value: "IVV.AX",
    label: "IVV - iShares S&P 500",
    description: "iShares S&P 500 ETF",
  },
  {
    value: "OOO.AX",
    label: "OOO - BetaShares Crude Oil",
    description: "BetaShares Crude Oil Index ETF",
  },
  {
    value: "NDQ.AX",
    label: "NDQ - BetaShares NASDAQ 100",
    description: "BetaShares NASDAQ 100 ETF",
  },
  {
    value: "ASIA.AX",
    label: "ASIA - BetaShares Asia Technology",
    description: "BetaShares Asia Technology Tigers ETF",
  },
  {
    value: "VDHG.AX",
    label: "VDHG - Vanguard Diversified High Growth",
    description: "Vanguard Diversified High Growth Index ETF",
  },
];

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

const Dashboard = () => {
  const [ticker, setTicker] = useState("VAS.AX");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthlyTarget, setMonthlyTarget] = useState(2000);
  const [totalTarget, setTotalTarget] = useState(10000);

  const filteredOptions = STOCK_OPTIONS.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setData(result);
    } catch (err) {
      setError(err.message || "Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = (option) => {
    setTicker(option.value);
    setDropdownOpen(false);
    fetchData(option.value);
  };

  // Fetch data when component mounts
  React.useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Market Analytics
              </h1>
              <p className="text-gray-400">Professional Trading Dashboard</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="monthly-target"
                  className="text-sm text-gray-400"
                >
                  Monthly Investment ($)
                </label>
                <input
                  id="monthly-target"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={monthlyTarget}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setMonthlyTarget(value ? Number(value) : 0);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="total-target" className="text-sm text-gray-400">
                  Total Target ($)
                </label>
                <input
                  id="total-target"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={totalTarget}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setTotalTarget(value ? Number(value) : 0);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>

              <button
                onClick={() => fetchData(ticker)}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mt-auto"
              >
                Refresh
              </button>
            </div>

            {/* Stock Selector Dropdown */}
            <div className="pt-6 relative w-full md:w-96">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg flex items-center justify-between hover:bg-gray-650 transition-colors"
              >
                <span>
                  {STOCK_OPTIONS.find((opt) => opt.value === ticker)?.label ||
                    ticker}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute mt-2 w-full bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700">
                  <div className="p-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search stocks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSelectStock(option)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-400">
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-400">Loading market data...</p>
          </div>
        ) : (
          data && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Current Price"
                  value={data.metrics?.current_price?.toFixed(2)}
                  trend={data.metrics?.momentum?.price_momentum * 100}
                  suffix=""
                  colorClass="text-white"
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
                  colorClass="text-green-400"
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

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">
                    Price and Moving Averages
                  </h2>
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

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">
                    Performance Metrics
                  </h2>
                  <div className="space-y-3">
                    {data.metrics?.performance_metrics &&
                      Object.entries(data.metrics.performance_metrics).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center border-b border-gray-700 py-2"
                          >
                            <span className="text-gray-400 capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span
                              className={`font-medium ${
                                typeof value === "number"
                                  ? value < 0
                                    ? "text-red-400"
                                    : "text-green-400"
                                  : "text-white"
                              }`}
                            >
                              {typeof value === "number"
                                ? value.toFixed(3)
                                : value}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
