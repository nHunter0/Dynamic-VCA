import pandas as pd
import numpy as np
from ta.volatility import BollingerBands, AverageTrueRange
from ta.trend import MACD, SMAIndicator, EMAIndicator
from ta.momentum import RSIIndicator, StochasticOscillator, StochRSIIndicator
from ta.volume import VolumeWeightedAveragePrice, AccDistIndexIndicator, OnBalanceVolumeIndicator
from finta import TA

class TechnicalIndicators:
    @staticmethod
    def add_trend_indicators(data: pd.DataFrame) -> None:
        macd = MACD(data['Close'])
        data['MACD'] = macd.macd()
        data['MACD_Signal'] = macd.macd_signal()
        data['MACD_Histogram'] = macd.macd_diff()
        data['SMA20'] = SMAIndicator(data['Close'], window=20).sma_indicator()
        data['SMA50'] = SMAIndicator(data['Close'], window=50).sma_indicator()
        data['SMA200'] = SMAIndicator(data['Close'], window=200).sma_indicator()
        data['EMA100'] = EMAIndicator(data['Close'], window=100).ema_indicator()

    @staticmethod
    def add_volatility_indicators(data: pd.DataFrame) -> None:
        bb = BollingerBands(data['Close'])
        data['BB_High'] = bb.bollinger_hband()
        data['BB_Mid'] = bb.bollinger_mavg()
        data['BB_Low'] = bb.bollinger_lband()
        atr = AverageTrueRange(high=data['High'], low=data['Low'], close=data['Close'], window=14)
        data['ATR'] = atr.average_true_range()
        data['Daily_Return'] = data['Close'].pct_change()
        data['Volatility'] = data['Daily_Return'].rolling(window=21).std() * np.sqrt(252)
    
    @staticmethod
    def add_momentum_indicators(data: pd.DataFrame) -> None:
        data['RSI'] = RSIIndicator(data['Close']).rsi()
        data['Stoch_K'] = StochasticOscillator(data['High'], data['Low'], data['Close']).stoch()
        data['Stoch_D'] = StochasticOscillator(data['High'], data['Low'], data['Close']).stoch_signal()
        data['Stoch_RSI'] = StochRSIIndicator(data['Close']).stochrsi_k()
        data['ROC'] = data['Close'].pct_change(periods=12)
        data['Price_Momentum'] = data['Close'].pct_change(periods=20)
        data['Volume_Momentum'] = data['Volume'].pct_change(periods=20)
    
    @staticmethod
    def add_volume_indicators(data: pd.DataFrame) -> None:
        vwap = VolumeWeightedAveragePrice(data['High'], data['Low'], data['Close'], data['Volume'])
        data['VWAP'] = vwap.volume_weighted_average_price()
        acc_dist = AccDistIndexIndicator(data['High'], data['Low'], data['Close'], data['Volume'])
        data['Acc_Dist'] = acc_dist.acc_dist_index()
        obv = OnBalanceVolumeIndicator(data['Close'], data['Volume'])
        data['OBV'] = obv.on_balance_volume()
    
    @staticmethod
    def add_custom_indicators(data: pd.DataFrame) -> None:
        data['HMA'] = TA.HMA(data)
        data['TEMA'] = TA.TEMA(data)
    
    @classmethod
    def add_all_indicators(cls, data: pd.DataFrame) -> None:
        cls.add_trend_indicators(data)
        cls.add_volatility_indicators(data)
        cls.add_momentum_indicators(data)
        cls.add_volume_indicators(data)
        cls.add_custom_indicators(data)
    
    @staticmethod
    def calculate_market_regime(data: pd.DataFrame) -> float:
        regime_signals = []
        current_price = data['Close'].iloc[-1]
        regime_signals.append(1 if current_price > data['SMA200'].iloc[-1] else -1)
        regime_signals.append(1 if data['SMA20'].iloc[-1] > data['SMA50'].iloc[-1] else -1)
        regime_signals.append(1 if data['EMA100'].iloc[-1] > data['SMA200'].iloc[-1] else -1)
        regime_signals.append(1 if data['RSI'].iloc[-1] > 50 else -1)
        regime_signals.append(1 if data['Stoch_RSI'].iloc[-1] > 0.5 else -1)
        avg_atr = data['ATR'].rolling(window=21).mean().iloc[-1]
        regime_signals.append(1 if data['ATR'].iloc[-1] < avg_atr else -1)
        obv_trend = 1 if data['OBV'].iloc[-1] > data['OBV'].iloc[-5] else -1
        regime_signals.append(obv_trend)
        return np.mean(regime_signals)
