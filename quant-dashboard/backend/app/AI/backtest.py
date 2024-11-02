import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from math import sqrt
from datetime import timedelta
from AI.predict_future import predict_future

def backtest_model(ticker, train_period="5y", test_days=30):
    """
    Backtest the model by training on historical data and testing against recent actual data.

    Parameters:
    - ticker (str): Stock ticker symbol
    - train_period (str): Period to fetch historical data for training
    - test_days (int): Number of days to predict and compare with actual prices

    Returns:
    - dict: Backtest metrics and comparison data
    """
    try:
        # Fetch historical data for the training period
        stock_data = yf.download(ticker, period=train_period)
        stock_data = stock_data.reset_index()

        if stock_data.empty:
            raise ValueError(f"No data found for ticker {ticker}")

        # Prepare data
        total_data_points = len(stock_data)
        train_data = stock_data.iloc[:total_data_points - test_days]
        test_data = stock_data.iloc[total_data_points - test_days:]

        predictions = []
        actual_prices = test_data['Close'].values
        dates = test_data['Date'].dt.strftime('%Y-%m-%d').values

        for i in range(test_days):
            # Train the model on data up to the i-th test day
            train_until = total_data_points - test_days + i
            train_subset = stock_data.iloc[:train_until]

            # Use your existing predict_future function but ensure it only uses train_subset
            result = predict_future_custom(train_subset, days_ahead=1)
            predictions.append(result['forecast'][-1]['yhat'])  # Get the forecasted price

        # Calculate backtest metrics
        mae = mean_absolute_error(actual_prices, predictions)
        mse = mean_squared_error(actual_prices, predictions)
        rmse = sqrt(mse)
        mape = np.mean(np.abs((actual_prices - predictions) / actual_prices)) * 100

        metrics = {
            "MAE": mae,
            "MSE": mse,
            "RMSE": rmse,
            "MAPE": mape
        }

        # Prepare comparison data for plotting
        comparison_df = pd.DataFrame({
            'date': dates,
            'actual_price': actual_prices,
            'predicted_price': predictions
        })

        # Convert DataFrame to dictionary for JSON response
        comparison_df = comparison_df.to_dict(orient='records')

        return {
            'metrics': metrics,
            'comparison_df': comparison_df
        }

    except Exception as e:
        print(f"Error in backtesting: {str(e)}")
        raise Exception(f"Error in backtesting: {str(e)}")
