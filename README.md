# Quantitative Trading Dashboard

A full-stack quantitative trading analysis platform that combines traditional technical indicators with AI/ML predictions for enhanced market analysis.

## Table of Contents

- [Coming Soon!](#-features-coming-soon)
- [Overview](#overview)
- [Features](#features)
- [Technical Indicators](#technical-indicators)
- [AI/ML Components](#aiml-components)
- [Installation](#installation)
- [Usage](#usage)

## ✨ Features Coming Soon!

- **Interactive Backtesting Interface**

  - Test trading strategies directly from the frontend
  - Visual backtesting results and performance metrics
  - Real-time strategy optimization
  - Custom parameter adjustment through UI

- **Advanced AI Model Customization**

  - Fine-tune ML models through the frontend interface
  - Customize training parameters
  - Adjust prediction timeframes
  - Model performance comparison tools

- **Complete ASX Stock Integration**
  - Access to all ASX-listed stocks via Yahoo Finance
  - Automated stock screening
  - Sector-based analysis
  - Market-wide trend detection

## Overview

![Frontend Overview](/screenshots/front-end-overview.png)

This platform integrates multiple layers of market analysis:

1. Traditional technical indicators
2. AI-driven price predictions
3. Risk management metrics
4. Market regime detection
5. Advanced backtesting capabilities

## Features

### Market Analysis

- Real-time market data fetching using yfinance
- Comprehensive technical analysis
- Multiple timeframe analysis
- Volume profile analysis
- Risk metrics calculation

### AI/ML Predictions

- Prophet model for trend forecasting
- LSTM-based advanced predictions
- Parallel processing for multiple model consensus
- Confidence intervals for predictions

### Risk Management

- Dynamic position sizing
- Volatility-adjusted recommendations
- Market regime-based risk scaling
- Automated stop-loss suggestions

## Technical Indicators

### Trend Indicators

1. **Moving Averages**

   - SMA (20, 50, 200 days)
   - EMA (100 days)
   - TEMA (Triple Exponential Moving Average)
   - HMA (Hull Moving Average)

2. **MACD (Moving Average Convergence Divergence)**
   - Signal Line
   - MACD Line
   - MACD Histogram
   - Used for trend direction and momentum

### Momentum Indicators

1. **RSI (Relative Strength Index)**

   - Measures speed and magnitude of price changes
   - Overbought > 70
   - Oversold < 30

2. **Stochastic Oscillator**

   - Stoch %K (Fast)
   - Stoch %D (Slow)
   - Measures price position relative to high-low range

3. **ROC (Rate of Change)**
   - Measures percentage price change over time
   - Used for momentum confirmation

### Volatility Indicators

1. **Bollinger Bands**

   - Upper Band (2 standard deviations)
   - Middle Band (20-day SMA)
   - Lower Band (2 standard deviations)
   - Used for volatility and potential reversal points

2. **ATR (Average True Range)**
   - Measures market volatility
   - Used for position sizing and stop-loss calculation

### Volume Indicators

1. **VWAP (Volume Weighted Average Price)**

   - Intraday trading reference
   - Institutional trading benchmark

2. **OBV (On-Balance Volume)**

   - Cumulative volume indicator
   - Confirms price trends with volume

3. **Accumulation/Distribution Line**
   - Measures money flow
   - Helps identify divergences

## AI/ML Components

### Prophet Model (Basic Forecasting)

- Facebook's Prophet model for time series forecasting
- Features:
  - Trend detection
  - Seasonality patterns
  - Holiday effects
  - Changepoint detection

### LSTM Model (Advanced Forecasting)

- Deep learning model for complex pattern recognition
- Architecture:
  ```
  LSTM(100) → Dropout(0.3) → LSTM(100) → Dropout(0.3) → LSTM(100) → Dense(1)
  ```
- Features:
  - Multi-feature input (price, volume, indicators)
  - Sequence learning
  - Non-linear pattern recognition

### Parallel Processing System

- Multiple model instances run simultaneously
- Benefits:
  - Reduced prediction variance
  - Improved reliability
  - Confidence interval calculation
  - Model consensus

### Backtesting Engine

- Historical performance testing
- Metrics:
  - MAE (Mean Absolute Error)
  - RMSE (Root Mean Square Error)
  - MAPE (Mean Absolute Percentage Error)
  - Custom performance metrics
  - Model back tests 5 years of data

## Market Regime Detection

The system uses multiple factors to determine market regime:

1. Trend Analysis

   - SMA relationships
   - EMA crossovers
   - Price momentum

2. Volatility Analysis

   - ATR trends
   - Bollinger Band width
   - Price range analysis

3. Volume Analysis
   - OBV trends
   - Volume momentum
   - A/D line analysis

## Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 14+ and npm
- Git

### Backend Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd quantitative-trading-dashboard
```

2. Create and activate a Python virtual environment:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

### Starting the Application

1. Start the Flask backend server (from the root directory):

```bash
# Windows
cd quant-dashboard/backend/app
python app.py

# macOS/Linux
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```

The backend server will start at `http://localhost:5000`

2. In a new terminal, start the frontend development server:

```bash
cd quant-dashboard/frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Troubleshooting

If you encounter issues with package installation:

1. Prophet installation:

```bash
# Windows
conda install -c conda-forge prophet

# macOS/Linux
pip install prophet
```

2. TensorFlow installation:

```bash
pip install tensorflow
```

If you get SSL certificate errors with yfinance:

```bash
pip install --upgrade certifi
```

## Usage

1. Access the dashboard at `http://localhost:5173`
2. Enter a stock ticker
3. Set your investment parameters:
   - Monthly target investment
   - Total investment target
   - Risk tolerance level

The system will provide:

- Current market analysis
- Investment recommendations
- AI-driven price predictions
- Risk assessment
- Position sizing suggestions

## API Endpoints

1. `/api/analyze`

   - Basic market analysis
   - Technical indicators
   - Investment recommendations

2. `/api/predict`

   - Basic AI predictions
   - Prophet model forecasts
   - Trend analysis

3. `/api/predict-advanced`

   - LSTM model predictions
   - Confidence intervals
   - Multiple timeframe analysis

4. `/api/backtest`
   - Historical performance
   - Model accuracy metrics
   - Strategy validation

## Development

- Frontend: React + Vite
- Backend: Flask
- AI/ML: Prophet, TensorFlow
- Data: yfinance, pandas

For development, use:

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
python app.py
```
