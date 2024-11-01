import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple
from ta.volatility import BollingerBands
from ta.trend import MACD, EMAIndicator, SMAIndicator
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.volume import VolumeWeightedAveragePrice, AccDistIndexIndicator, OnBalanceVolumeIndicator
from finta import TA

class TechnicalIndicators:
    @staticmethod
    def add_trend_indicators(data: pd.DataFrame) -> None:
        """Add trend-based indicators to the dataframe."""
        # MACD
        macd = MACD(data['Close'])
        data['macd'] = macd.macd()
        data['macd_signal'] = macd.macd_signal()
        data['macd_histogram'] = macd.macd_diff()
        
        # Moving Averages
        sma_20 = SMAIndicator(data['Close'], window=20)
        sma_50 = SMAIndicator(data['Close'], window=50)
        sma_200 = SMAIndicator(data['Close'], window=200)
        data['sma_20'] = sma_20.sma_indicator()
        data['sma_50'] = sma_50.sma_indicator()
        data['sma_200'] = sma_200.sma_indicator()
    
    @staticmethod
    def add_volatility_indicators(data: pd.DataFrame) -> None:
        """Add volatility-based indicators to the dataframe."""
        # Bollinger Bands
        bb = BollingerBands(data['Close'])
        data['bb_high'] = bb.bollinger_hband()
        data['bb_mid'] = bb.bollinger_mavg()
        data['bb_low'] = bb.bollinger_lband()
        
        # Custom Volatility
        data['daily_return'] = data['Close'].pct_change()
        data['volatility'] = data['daily_return'].rolling(window=21).std() * np.sqrt(252)
    
    @staticmethod
    def add_momentum_indicators(data: pd.DataFrame) -> None:
        """Add momentum-based indicators to the dataframe."""
        # RSI
        rsi = RSIIndicator(data['Close'])
        data['rsi'] = rsi.rsi()
        
        # Stochastic
        stoch = StochasticOscillator(data['High'], data['Low'], data['Close'])
        data['stoch_k'] = stoch.stoch()
        data['stoch_d'] = stoch.stoch_signal()
        
        # Custom Momentum
        data['price_momentum'] = data['Close'].pct_change(periods=20)
        data['volume_momentum'] = data['Volume'].pct_change(periods=20)
    
    @staticmethod
    def add_volume_indicators(data: pd.DataFrame) -> None:
        """Add volume-based indicators to the dataframe."""
        # VWAP
        vwap = VolumeWeightedAveragePrice(data['High'], data['Low'], data['Close'], data['Volume'])
        data['vwap'] = vwap.volume_weighted_average_price()
        
        # Accumulation/Distribution
        acc_dist = AccDistIndexIndicator(data['High'], data['Low'], data['Close'], data['Volume'])
        data['acc_dist'] = acc_dist.acc_dist_index()
        
        # On Balance Volume
        obv = OnBalanceVolumeIndicator(data['Close'], data['Volume'])
        data['obv'] = obv.on_balance_volume()
    
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
        volume_profile = data.groupby(price_bins, observed=True)['Volume'].sum() #observed=True to shut up warn mssg
        
        # Point of Control (price level with highest volume)
        poc_index = volume_profile.idxmax()
        poc_price = poc_index.mid
        
        return {
            'poc_price': poc_price,
            'volume_distribution': volume_profile
        }
    
    @staticmethod
    def calculate_market_regime(data: pd.DataFrame) -> float:
        """Calculate market regime using multiple indicators."""
        regime_signals = []
        
        # Trend regime based on moving averages
        current_price = data['Close'].iloc[-1]
        regime_signals.append(1 if current_price > data['sma_200'].iloc[-1] else -1)
        regime_signals.append(1 if data['sma_20'].iloc[-1] > data['sma_50'].iloc[-1] else -1)
        
        # Momentum regime based on RSI
        regime_signals.append(1 if data['rsi'].iloc[-1] > 50 else -1)
        
        # Volatility regime based on Bollinger Bandwidth
        bb_width = (data['bb_high'].iloc[-1] - data['bb_low'].iloc[-1]) / data['bb_mid'].iloc[-1]
        regime_signals.append(1 if bb_width < bb_width.mean() else -1)
        
        # Volume regime based on OBV trend
        obv_trend = 1 if data['obv'].iloc[-1] > data['obv'].iloc[-5] else -1
        regime_signals.append(obv_trend)
        
        return np.mean(regime_signals)