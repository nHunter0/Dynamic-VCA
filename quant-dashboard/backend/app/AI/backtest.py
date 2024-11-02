import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from predict_future_advanced import predict_future_advanced_parallel

def backtest_model(ticker: str, train_period='5y', test_days=30):
    """
    Backtest the prediction model on historical data.
    
    Parameters:
    - ticker (str): Stock ticker symbol
    - train_period (str): Time period for training data (e.g., '5y' for 5 years)
    - test_days (int): Number of days for backtesting (rolling predictions)
    
    Returns:
    - dict: Dictionary containing backtesting metrics and a comparison dataframe
    """
    # Fetch historical data
    data = yf.download(ticker, period=train_period)
    data = data.reset_index()
    
    if data.empty:
        raise ValueError(f"No data found for ticker {ticker}")

    # Split data into training and testing sets
    test_data = data[-test_days:]
    test_dates = test_data['Date']
    
    # Run model predictions for test period
    try:
        result = predict_future_advanced_parallel(ticker=ticker, days_ahead=test_days)
        predictions = result['forecast']
        
        # Convert prediction results to DataFrame
        prediction_df = pd.DataFrame(predictions)
        prediction_df.set_index('ds', inplace=True)
        prediction_df.index = pd.to_datetime(prediction_df.index)
        
        # Filter actual values for the test period
        actuals = test_data.set_index('Date')['Close']
        actuals.index = pd.to_datetime(actuals.index)
        
        # Ensure both actual and predicted values are 1-dimensional
        comparison_df = pd.DataFrame({
            'actual_price': actuals.values.flatten(),  # Flatten to ensure 1D
            'predicted_price': prediction_df['yhat'].values.flatten()  # Flatten to ensure 1D
        }, index=actuals.index)
        
        # Calculate errors
        mae = mean_absolute_error(comparison_df['actual_price'], comparison_df['predicted_price'])
        mse = mean_squared_error(comparison_df['actual_price'], comparison_df['predicted_price'])
        mape = np.mean(np.abs((comparison_df['actual_price'] - comparison_df['predicted_price']) / comparison_df['actual_price'])) * 100
        
        metrics = {
            'MAE': mae,
            'MSE': mse,
            'RMSE': np.sqrt(mse),
            'MAPE': mape
        }
        
        print("\nBacktest Metrics:")
        print(f"Mean Absolute Error (MAE): {metrics['MAE']}")
        print(f"Mean Squared Error (MSE): {metrics['MSE']}")
        print(f"Root Mean Squared Error (RMSE): {metrics['RMSE']}")
        print(f"Mean Absolute Percentage Error (MAPE): {metrics['MAPE']:.2f}%")
        
        return {
            'metrics': metrics,
            'comparison_df': comparison_df
        }
        
    except Exception as e:
        print(f"Error in backtesting: {e}")
        return None

# Run backtesting
if __name__ == "__main__":
    ticker = "VAS.AX"  # Example ticker
    test_days = 30  # Backtest over the last 30 days of available data
    results = backtest_model(ticker, test_days=test_days)
    
    # Display comparison DataFrame and metrics
    if results:
        comparison_df = results['comparison_df']
        print("\nBacktest Results (Predicted vs Actual):")
        print(comparison_df)
