# technical_indicators.py
import pandas as pd
import numpy as np
from typing import Dict, Any
from ta.volatility import BollingerBands
from ta.trend import MACD, SMAIndicator
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.volume import VolumeWeightedAveragePrice, AccDistIndexIndicator, OnBalanceVolumeIndicator
from finta import TA

class TechnicalIndicators:
    @staticmethod
    def add_trend_indicators(data: pd.DataFrame) -> None:
        """Add trend-based indicators to the dataframe."""
        # MACD
        macd = MACD(data['Close'])
        data['MACD'] = macd.macd()
        data['MACD_Signal'] = macd.macd_signal()
        data['MACD_Histogram'] = macd.macd_diff()
        
        # Moving Averages
        sma_20 = SMAIndicator(data['Close'], window=20)
        sma_50 = SMAIndicator(data['Close'], window=50)
        sma_200 = SMAIndicator(data['Close'], window=200)
        data['SMA20'] = sma_20.sma_indicator()
        data['SMA50'] = sma_50.sma_indicator()
        data['SMA200'] = sma_200.sma_indicator()

    @staticmethod
    def add_volatility_indicators(data: pd.DataFrame) -> None:
        """Add volatility-based indicators to the dataframe."""
        # Bollinger Bands
        bb = BollingerBands(data['Close'])
        data['BB_High'] = bb.bollinger_hband()
        data['BB_Mid'] = bb.bollinger_mavg()
        data['BB_Low'] = bb.bollinger_lband()
        
        # Custom Volatility
        data['Daily_Return'] = data['Close'].pct_change()
        data['Volatility'] = data['Daily_Return'].rolling(window=21).std() * np.sqrt(252)
    
    @staticmethod
    def add_momentum_indicators(data: pd.DataFrame) -> None:
        """Add momentum-based indicators to the dataframe."""
        # RSI
        rsi = RSIIndicator(data['Close'])
        data['RSI'] = rsi.rsi()
        
        # Stochastic Oscillator
        stoch = StochasticOscillator(data['High'], data['Low'], data['Close'])
        data['Stoch_K'] = stoch.stoch()
        data['Stoch_D'] = stoch.stoch_signal()
        
        # Custom Momentum
        data['Price_Momentum'] = data['Close'].pct_change(periods=20)
        data['Volume_Momentum'] = data['Volume'].pct_change(periods=20)
    
    @staticmethod
    def add_volume_indicators(data: pd.DataFrame) -> None:
        """Add volume-based indicators to the dataframe."""
        # VWAP
        vwap = VolumeWeightedAveragePrice(data['High'], data['Low'], data['Close'], data['Volume'])
        data['VWAP'] = vwap.volume_weighted_average_price()
        
        # Accumulation/Distribution
        acc_dist = AccDistIndexIndicator(data['High'], data['Low'], data['Close'], data['Volume'])
        data['Acc_Dist'] = acc_dist.acc_dist_index()
        
        # On Balance Volume
        obv = OnBalanceVolumeIndicator(data['Close'], data['Volume'])
        data['OBV'] = obv.on_balance_volume()
    
    @staticmethod
    def add_custom_indicators(data: pd.DataFrame) -> None:
        """Add custom and Finta-based indicators to the dataframe."""
        # Finta Indicators
        data['HMA'] = TA.HMA(data)  # Hull Moving Average
        data['TEMA'] = TA.TEMA(data)  # Triple Exponential Moving Average
    
    @classmethod
    def add_all_indicators(cls, data: pd.DataFrame) -> None:
        """Add all technical indicators to the dataframe."""
        cls.add_trend_indicators(data)
        cls.add_volatility_indicators(data)
        cls.add_momentum_indicators(data)
        cls.add_volume_indicators(data)
        cls.add_custom_indicators(data)
    
    @staticmethod
    def calculate_volume_profile(data: pd.DataFrame, bins: int = 50) -> Dict[str, Any]:
        """Calculate Volume Profile metrics."""
        price_bins = pd.cut(data['Close'], bins=bins)
        volume_profile = data.groupby(price_bins, observed=True)['Volume'].sum()
        
        # Point of Control (price level with highest volume)
        poc_index = volume_profile.idxmax()
        poc_price = poc_index.mid
        
        return {
            'poc_price': poc_price,
            'volume_distribution': volume_profile.to_dict()
        }
    
    @staticmethod
    def calculate_market_regime(data: pd.DataFrame) -> float:
        """Calculate market regime using multiple indicators."""
        regime_signals = []
        
        # Trend regime based on moving averages
        current_price = data['Close'].iloc[-1]
        regime_signals.append(1 if current_price > data['SMA200'].iloc[-1] else -1)
        regime_signals.append(1 if data['SMA20'].iloc[-1] > data['SMA50'].iloc[-1] else -1)
        
        # Momentum regime based on RSI
        regime_signals.append(1 if data['RSI'].iloc[-1] > 50 else -1)
        
        # Volatility regime based on Bollinger Bandwidth
        bb_width = (data['BB_High'].iloc[-1] - data['BB_Low'].iloc[-1]) / data['BB_Mid'].iloc[-1]
        regime_signals.append(1 if bb_width < data['BB_Mid'].rolling(window=21).mean().iloc[-1] else -1)
        
        # Volume regime based on OBV trend
        obv_trend = 1 if data['OBV'].iloc[-1] > data['OBV'].iloc[-5] else -1
        regime_signals.append(obv_trend)
        
        return np.mean(regime_signals)
