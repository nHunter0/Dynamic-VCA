# summary_generator.py

class AnalysisSummary:
    @staticmethod
    def generate_combined_summary(market_data, ai_prediction, backtest_data=None):
        """Generate a comprehensive summary combining AI predictions and market analysis."""
        try:
            current_price = market_data['metrics']['current_price']
            latest_prediction = ai_prediction[-1]['yhat']
            price_change = ((latest_prediction - current_price) / current_price) * 100
            
            # Market conditions
            rsi = market_data['metrics']['technical_metrics']['rsi']
            volatility = market_data['metrics']['performance_metrics']['volatility']
            market_regime = market_data['metrics']['performance_metrics']['market_regime']
            
            # Determine trend strength
            trend_strength = "Strong" if abs(market_regime) > 0.7 else "Moderate" if abs(market_regime) > 0.3 else "Weak"
            
            # Risk assessment
            risk_level = "High" if volatility > 0.25 else "Moderate" if volatility > 0.15 else "Low"
            
            # Trading conditions
            overbought = rsi > 70
            oversold = rsi < 30
            
            # Generate trading signal
            signal = "HOLD"
            if price_change > 5 and not overbought:
                signal = "BUY"
            elif price_change < -5 and not oversold:
                signal = "SELL"
            
            summary = {
                "ai_analysis": {
                    "current_price": current_price,
                    "predicted_price": latest_prediction,
                    "price_change_percent": price_change,
                    "forecast_confidence": "High" if volatility < 0.2 else "Moderate" if volatility < 0.3 else "Low"
                },
                "market_analysis": {
                    "trend": {
                        "direction": "Bullish" if market_regime > 0 else "Bearish",
                        "strength": trend_strength
                    },
                    "technical_indicators": {
                        "rsi": rsi,
                        "volatility": volatility * 100,  # Convert to percentage
                        "market_regime": market_regime
                    },
                    "risk_assessment": {
                        "level": risk_level,
                        "factors": {
                            "volatility_status": "High" if volatility > 0.25 else "Normal",
                            "rsi_status": "Overbought" if overbought else "Oversold" if oversold else "Normal"
                        }
                    }
                },
                "trading_recommendation": {
                    "signal": signal,
                    "confidence": "High" if abs(price_change) > 10 and abs(market_regime) > 0.5 else "Moderate",
                    "position_sizing": market_data['investment_recommendation']['allocation_multiplier']
                }
            }
            
            # Add backtest metrics if available
            if backtest_data:
                summary["model_performance"] = {
                    "mae": backtest_data['metrics']['MAE'],
                    "rmse": backtest_data['metrics']['RMSE'],
                    "mape": backtest_data['metrics']['MAPE']
                }
            
            return summary
            
        except Exception as e:
            raise Exception(f"Error generating summary: {str(e)}")