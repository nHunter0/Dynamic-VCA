import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from typing import Dict, Any
from technical_indicators import TechnicalIndicators
from report_generator import ReportGenerator

class EnhancedQuantStrategy:
    def __init__(self, ticker="VAS.AX", monthly_target=2000, total_goal=8000,
                 high_price_ratio=0.55, low_price_ratio=1.45):
        self.ticker = ticker
        self.monthly_target = monthly_target
        self.total_goal = total_goal
        self.high_price_ratio = high_price_ratio
        self.low_price_ratio = low_price_ratio
        self.indicators = TechnicalIndicators()
        
    def calculate_performance_metrics(self, returns: pd.Series) -> Dict[str, float]:
        """Calculate key performance metrics."""
        daily_returns = returns.dropna()
        risk_free_rate = 0.02
        
        # Performance calculations
        excess_returns = daily_returns - (risk_free_rate / 252)
        sharpe_ratio = np.sqrt(252) * (excess_returns.mean() / daily_returns.std())
        
        downside_returns = daily_returns[daily_returns < 0]
        sortino_ratio = np.sqrt(252) * (daily_returns.mean() / downside_returns.std())
        
        cumulative_returns = (1 + daily_returns).cumprod()
        rolling_max = cumulative_returns.expanding().max()
        drawdowns = cumulative_returns / rolling_max - 1
        max_drawdown = drawdowns.min()
        
        calmar_ratio = (daily_returns.mean() * 252) / abs(max_drawdown)
        var_95 = np.percentile(daily_returns, 5)
        
        return {
            'sharpe_ratio': sharpe_ratio,
            'sortino_ratio': sortino_ratio,
            'max_drawdown': max_drawdown,
            'calmar_ratio': calmar_ratio,
            'var_95': var_95,
            'annualized_return': (daily_returns.mean() * 252),
            'annualized_volatility': (daily_returns.std() * np.sqrt(252))
        }

    def get_historical_data(self, days: int = 365) -> pd.DataFrame:
        """Fetch and prepare historical data with indicators."""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        try:
            stock = yf.Ticker(self.ticker)
            data = stock.history(start=start_date, end=end_date)
            
            if data.empty:
                raise ValueError(f"No data found for {self.ticker}")
            
            # Add all technical indicators
            self.indicators.add_all_indicators(data)
            
            return data
        except Exception as e:
            raise Exception(f"Error fetching data: {str(e)}")
    
    def calculate_advanced_metrics(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Calculate advanced metrics using technical indicators."""
        # Calculate basic metrics
        performance_metrics = self.calculate_performance_metrics(data['daily_return'])
        volume_profile = self.indicators.calculate_volume_profile(data)
        market_regime = self.indicators.calculate_market_regime(data)
        
        return {
            'current_price': data['Close'].iloc[-1],
            'performance_metrics': performance_metrics,
            'technical_metrics': {
                'rsi': data['rsi'].iloc[-1],
                'macd_hist': data['macd_histogram'].iloc[-1],
                'stoch_k': data['stoch_k'].iloc[-1],
                'stoch_d': data['stoch_d'].iloc[-1],
                'sma_20': data['sma_20'].iloc[-1],
                'sma_50': data['sma_50'].iloc[-1],
                'sma_200': data['sma_200'].iloc[-1],
                'obv': data['obv'].iloc[-1]
            },
            'volume_profile': {
                'poc': volume_profile['poc_price'],
                'vwap': data['vwap'].iloc[-1]
            },
            'market_regime': market_regime,
            'volatility': data['volatility'].iloc[-1],
            'momentum': {
                'price_momentum': data['price_momentum'].iloc[-1],
                'volume_momentum': data['volume_momentum'].iloc[-1]
            }
        }
        
    def calculate_position_size(self, metrics: Dict[str, Any]) -> float:
        """Calculate optimal position size."""
        volatility = metrics['volatility']
        market_regime = metrics['market_regime']
        
        win_rate = (metrics['technical_metrics']['rsi'] / 100 + 
                   (1 if metrics['momentum']['price_momentum'] > 0 else 0)) / 2
        
        profit_loss_ratio = abs(metrics['performance_metrics']['var_95'])
        kelly_fraction = win_rate - ((1 - win_rate) / profit_loss_ratio)
        
        vol_adjustment = 1 - (volatility / 2)
        regime_adjustment = (market_regime + 1) / 2
        
        position_multiplier = kelly_fraction * vol_adjustment * regime_adjustment
        
        return np.clip(position_multiplier, self.high_price_ratio, self.low_price_ratio)

    def calculate_recommendation(self) -> Dict[str, Any]:
        """Generate investment recommendation."""
        data = self.get_historical_data()
        metrics = self.calculate_advanced_metrics(data)
        
        position_multiplier = self.calculate_position_size(metrics)
        
        scenario = "high" if metrics['market_regime'] > 0.5 else \
                  "low" if metrics['market_regime'] < -0.5 else "neutral"
            
        return {
            'metrics': metrics,
            'recommended_investment': self.monthly_target * position_multiplier,
            'scenario': scenario,
            'position_multiplier': position_multiplier
        }
    
    def generate_report(self) -> str:
        """Generate comprehensive analysis report."""
        try:
            results = self.calculate_recommendation()
            return ReportGenerator.generate_analysis_report(
                results=results,
                ticker=self.ticker,
                monthly_target=self.monthly_target
            )
        except Exception as e:
            return f"Error generating report: {str(e)}"

def main():
    """Main function to demonstrate the enhanced strategy."""
    strategy = EnhancedQuantStrategy()
    try:
        print(strategy.generate_report())
    except Exception as e:
        print(f"Error running strategy: {str(e)}")

if __name__ == "__main__":
    main()