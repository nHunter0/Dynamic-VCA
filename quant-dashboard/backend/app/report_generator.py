# command line only. 

class ReportGenerator:
    @staticmethod
    def generate_analysis_report(results: dict, ticker: str, monthly_target: float) -> str:
        """Generate comprehensive analysis report with formatted output."""
        try:
            metrics = results['metrics']
            
            # Calculate signals
            price = metrics['current_price']
            sma20 = metrics['technical_metrics']['sma_20']
            sma50 = metrics['technical_metrics']['sma_50']
            sma200 = metrics['technical_metrics']['sma_200']
            
            # Determine trend signals
            trend_signals = {
                'Short-term': 'Bullish' if price > sma20 else 'Bearish',
                'Medium-term': 'Bullish' if sma20 > sma50 else 'Bearish',
                'Long-term': 'Bullish' if sma50 > sma200 else 'Bearish'
            }
            
            # Determine RSI conditions
            rsi = metrics['technical_metrics']['rsi']
            rsi_signal = 'Oversold' if rsi < 30 else 'Overbought' if rsi > 70 else 'Neutral'
            
            # Determine support/resistance levels
            support_level = min(metrics['volume_profile']['poc'], sma200)
            resistance_level = max(metrics['volume_profile']['vwap'], sma20)
            
            report = f"""
╔══════════════════════════════════════════════════════════════╗
║           Quantitative Analysis Report for {ticker}             
╚══════════════════════════════════════════════════════════════╝

MARKET OVERVIEW
Current Price: ${price:.2f}
Trend Analysis:
• Short-term (20D): {trend_signals['Short-term']}
• Medium-term (50D): {trend_signals['Medium-term']}
• Long-term (200D): {trend_signals['Long-term']}

KEY METRICS SUMMARY
──────────────────────────────────────────────────────────────
1. Performance Metrics (Risk-Adjusted Returns)
   ✦ Sharpe Ratio: {metrics['performance_metrics']['sharpe_ratio']:.2f} 
     → {' Strong' if metrics['performance_metrics']['sharpe_ratio'] > 1 else 'Moderate' if metrics['performance_metrics']['sharpe_ratio'] > 0.5 else 'Weak'} risk-adjusted returns
   ✦ Sortino Ratio: {metrics['performance_metrics']['sortino_ratio']:.2f}
     → {' Excellent' if metrics['performance_metrics']['sortino_ratio'] > 2 else 'Good' if metrics['performance_metrics']['sortino_ratio'] > 1 else 'Poor'} downside risk management
   ✦ Max Drawdown: {metrics['performance_metrics']['max_drawdown']:.2%}
     → {'Low' if abs(metrics['performance_metrics']['max_drawdown']) < 10 else 'Moderate' if abs(metrics['performance_metrics']['max_drawdown']) < 20 else 'High'} historical risk

2. Technical Signals
   ✦ RSI ({rsi:.1f}): {rsi_signal}
   ✦ MACD Histogram: {metrics['technical_metrics']['macd_hist']:.4f}
     → {'Bullish momentum' if metrics['technical_metrics']['macd_hist'] > 0 else 'Bearish momentum'}
   ✦ Stochastic K/D: {metrics['technical_metrics']['stoch_k']:.1f}/{metrics['technical_metrics']['stoch_d']:.1f}
     → {'Oversold' if metrics['technical_metrics']['stoch_k'] < 20 else 'Overbought' if metrics['technical_metrics']['stoch_k'] > 80 else 'Neutral'} conditions

3. Key Price Levels
   ✦ Support: ${support_level:.2f}
   ✦ Resistance: ${resistance_level:.2f}
   ✦ VWAP: ${metrics['volume_profile']['vwap']:.2f}

4. Momentum & Volume
   ✦ Price Momentum (20D): {metrics['momentum']['price_momentum']:.2%}
   ✦ Volume Momentum (20D): {metrics['momentum']['volume_momentum']:.2%}
     → {'Strong' if abs(metrics['momentum']['volume_momentum']) > 50 else 'Moderate' if abs(metrics['momentum']['volume_momentum']) > 20 else 'Weak'} volume activity

5. Risk Assessment
   ✦ Market Regime: {metrics['market_regime']:.2f}
   ✦ Current Volatility: {metrics['volatility']:.2%}
   ✦ Annualized Metrics:
     • Return: {metrics['performance_metrics']['annualized_return']:.2%}
     • Volatility: {metrics['performance_metrics']['annualized_volatility']:.2%}

INVESTMENT RECOMMENDATION
──────────────────────────────────────────────────────────────
→ Base Target: ${monthly_target:,.2f}
→ Position Multiplier: {results['position_multiplier']:.2f}x
→ Recommended Investment: ${results['recommended_investment']:,.2f}

ANALYSIS SUMMARY
{'-' * 70}
Market Conditions: {results['scenario'].upper()}
Primary Signals:
• {'✓' if rsi < 40 else '✗'} RSI suggests {'buying opportunity' if rsi < 40 else 'caution'}
• {'✓' if metrics['technical_metrics']['macd_hist'] > 0 else '✗'} MACD shows {'positive' if metrics['technical_metrics']['macd_hist'] > 0 else 'negative'} momentum
• {'✓' if price > sma200 else '✗'} Price {'above' if price > sma200 else 'below'} long-term trend

Position Sizing Logic:
• Volatility Adjustment: {'Conservative' if metrics['volatility'] > 0.2 else 'Standard'}
• Risk Level: {'High' if metrics['volatility'] > 0.25 else 'Moderate' if metrics['volatility'] > 0.15 else 'Low'}
• Market Regime: {'Bullish' if metrics['market_regime'] > 0.5 else 'Bearish' if metrics['market_regime'] < -0.5 else 'Neutral'}

RISK MANAGEMENT NOTE
{'-' * 70}
• Set stop loss near ${support_level:.2f} (major support)
• Consider taking profits near ${resistance_level:.2f}
• Current risk/reward ratio: {abs((resistance_level - price) / (price - support_level)):.2f}

Disclaimer: This analysis is based on historical data and technical indicators.
Always perform your own due diligence before making investment decisions.
"""
            return report
            
        except Exception as e:
            return f"Error generating report: {str(e)}"