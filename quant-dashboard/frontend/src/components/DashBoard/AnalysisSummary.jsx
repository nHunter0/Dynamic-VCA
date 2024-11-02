import React from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

const AnalysisSummary = ({ summary, backtest }) => {
  if (!summary) return null;

  const {
    ai_analysis,
    market_analysis,
    trading_recommendation,
    model_performance,
  } = summary;

  const getSignalIcon = (signal) => {
    switch (signal) {
      case "BUY":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "SELL":
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return "text-green-400";
      case "moderate":
        return "text-yellow-400";
      case "low":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Analysis Card */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold">Trading Analysis Summary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Analysis Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              AI Prediction Analysis
            </h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-900/50 p-3 rounded-lg">
                <p>Current Price: ${ai_analysis.current_price.toFixed(2)}</p>
                <p>
                  Predicted Price: ${ai_analysis.predicted_price.toFixed(2)}
                </p>
                <p
                  className={
                    ai_analysis.price_change_percent >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  Expected Change: {ai_analysis.price_change_percent.toFixed(2)}
                  %
                </p>
                <p>
                  Forecast Confidence:
                  <span
                    className={getConfidenceColor(
                      ai_analysis.forecast_confidence
                    )}
                  >
                    {" "}
                    {ai_analysis.forecast_confidence}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Market Analysis Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Market Conditions</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-900/50 p-3 rounded-lg">
                <p>
                  Trend: {market_analysis.trend.direction} (
                  {market_analysis.trend.strength})
                </p>
                <p>
                  RSI: {market_analysis.technical_indicators.rsi.toFixed(2)}
                </p>
                <p>
                  Volatility:{" "}
                  {market_analysis.technical_indicators.volatility.toFixed(2)}%
                </p>
                <p>Risk Level: {market_analysis.risk_assessment.level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Section */}
        <div className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold">Trading Recommendation</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Signal:</span>
              <div className="flex items-center gap-1">
                {getSignalIcon(trading_recommendation.signal)}
                <span className="font-bold">
                  {trading_recommendation.signal}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-400">Confidence:</span>
              <span
                className={` ml-2 ${getConfidenceColor(
                  trading_recommendation.confidence
                )}`}
              >
                {trading_recommendation.confidence}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Position Size:</span>
              <span className="ml-2">
                {trading_recommendation.position_sizing.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance Card */}
      {(model_performance || backtest) && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">
              Model Performance (5Y Backtest)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {backtest && (
              <>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-gray-400 mb-1">RMSE</p>
                  <p className="text-lg">${backtest.metrics.RMSE.toFixed(2)}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-gray-400 mb-1">MAE</p>
                  <p className="text-lg">${backtest.metrics.MAE.toFixed(2)}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-gray-400 mb-1">MAPE</p>
                  <p className="text-lg">{backtest.metrics.MAPE.toFixed(2)}%</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Trading Notes */}
      <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-400">
        <p>
          • Risk Management: Set stops based on volatility and position size
        </p>
        <p>
          • Market Regime: {market_analysis.trend.direction} trend with{" "}
          {market_analysis.trend.strength.toLowerCase()} momentum
        </p>
        <p>
          • Volume Profile: {trading_recommendation.confidence.toLowerCase()}{" "}
          confidence in current price levels
        </p>
      </div>
    </div>
  );
};

export default AnalysisSummary;
