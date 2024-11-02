# main_strategy.py
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from technical_indicators import TechnicalIndicators

class EnhancedQuantStrategy:
    def __init__(self, ticker="VAS.AX", monthly_target=2000, total_target=10000,
                 high_price_ratio=0.55, low_price_ratio=1.45):
        self.ticker = ticker
        self.monthly_target = monthly_target
        self.total_target = total_target
        self.high_price_ratio = high_price_ratio
        self.low_price_ratio = low_price_ratio
        self.indicators = TechnicalIndicators()
        
    def get_historical_data(self, days=365):
        """Fetch and prepare historical data with indicators."""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        try:
            stock = yf.Ticker(self.ticker)
            data = stock.history(start=start_date, end=end_date)
            
            if data.empty:
                raise ValueError(f"No data found for {self.ticker}")
            
            # Calculate daily returns
            data['Daily_Return'] = data['Close'].pct_change()
            
            # Add technical indicators
            self.indicators.add_all_indicators(data)
            
            # Prepare moving averages data for chart
            last_30_days = data[-30:].copy()
            last_30_days = last_30_days.reset_index()
            last_30_days['Date'] = last_30_days['Date'].dt.strftime('%Y-%m-%d')
            
            moving_averages = []
            for day in range(len(last_30_days)):
                moving_averages.append({
                    'date': last_30_days['Date'].iloc[day],
                    'price': last_30_days['Close'].iloc[day],
                    'SMA20': last_30_days['SMA20'].iloc[day],
                    'SMA50': last_30_days['SMA50'].iloc[day],
                    'SMA200': last_30_days['SMA200'].iloc[day]
                })
            
            return data, moving_averages
        except Exception as e:
            raise Exception(f"Error fetching data: {str(e)}")
    
    def calculate_investment_recommendation(self, current_price, market_regime, volatility):
        """Calculate detailed investment recommendations."""
        # Base position size calculation
        position_multiplier = 1.0
        
        # Adjust for market regime
        if market_regime > 0.5:  # Strong bullish
            position_multiplier *= 1.2
        elif market_regime < -0.5:  # Strong bearish
            position_multiplier *= 0.8
            
        # Adjust for volatility
        if volatility > 0.25:  # High volatility
            position_multiplier *= 0.8
        elif volatility < 0.15:  # Low volatility
            position_multiplier *= 1.2
            
        # Calculate recommended investment
        recommended_amount = self.monthly_target * position_multiplier
        
        # Calculate units based on current price
        recommended_units = int(recommended_amount / current_price) if current_price > 0 else 0
        
        # Calculate remaining target
        total_invested = self.monthly_target  # This should be tracked over time in a real system
        remaining_target = max(0, self.total_target - total_invested)
        
        return {
            'recommended_amount': recommended_amount,
            'recommended_units': recommended_units,
            'remaining_target': remaining_target,
            'allocation_multiplier': position_multiplier
        }
    
    def calculate_recommendation(self):
        """Generate investment recommendation."""
        try:
            data, moving_averages = self.get_historical_data()
            
            # Get the latest values
            current_price = data['Close'].iloc[-1]
            rsi = data['RSI'].iloc[-1] if 'RSI' in data else 50
            
            # Calculate momentum and volatility
            price_momentum = (current_price / data['Close'].iloc[-20] - 1) if len(data) >= 20 else 0
            volume_momentum = (data['Volume'].iloc[-1] / data['Volume'].iloc[-20] - 1) if len(data) >= 20 else 0
            volatility = data['Daily_Return'].std() * np.sqrt(252)
            
            # Calculate market regime
            sma_200 = data['SMA200'].iloc[-1]
            market_regime = 1 if current_price > sma_200 else -1
            
            # Get investment recommendations
            investment_rec = self.calculate_investment_recommendation(
                current_price, market_regime, volatility
            )
            
            # Prepare the results
            results = {
                'metrics': {
                    'current_price': current_price,
                    'technical_metrics': {
                        'rsi': rsi,
                        'sma_20': data['SMA20'].iloc[-1],
                        'sma_50': data['SMA50'].iloc[-1],
                        'sma_200': sma_200,
                    },
                    'momentum': {
                        'price_momentum': price_momentum,
                        'volume_momentum': volume_momentum
                    },
                    'performance_metrics': {
                        'volatility': volatility,
                        'sharpe_ratio': (price_momentum / volatility) if volatility != 0 else 0,
                        'market_regime': market_regime
                    }
                },
                'investment_recommendation': {
                    'recommended_amount': investment_rec['recommended_amount'],
                    'recommended_units': investment_rec['recommended_units'],
                    'remaining_target': investment_rec['remaining_target'],
                    'allocation_multiplier': investment_rec['allocation_multiplier']
                },
                'moving_averages_data': moving_averages,
                'scenario': 'high' if market_regime > 0 else 'low'
            }
            
            return results
            
        except Exception as e:
            raise Exception(f"Error in calculation: {str(e)}")
