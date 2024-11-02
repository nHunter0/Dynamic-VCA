import yfinance as yf
import pandas as pd
from prophet import Prophet

def predict_future(ticker: str, days_ahead: int = 30):
    """Predict future prices using AI model."""
    try:
        # Fetch historical data
        data = yf.download(ticker, period='5y')
        data = data.reset_index()
        
        # Debug print
        print("Raw data structure:")
        print(data.head())
        print("\nData types:")
        print(data.dtypes)
        
        # Prepare data for Prophet
        prophet_df = pd.DataFrame()
        # Convert datetime to timezone-naive
        prophet_df['ds'] = data['Date'].dt.tz_localize(None)
        prophet_df['y'] = data['Close'].values
        
        # Drop any rows with NaN values
        prophet_df = prophet_df.dropna()
        
        print("\nPrepared prophet_df:")
        print(prophet_df.head())
        print("\nProphet DataFrame types:")
        print(prophet_df.dtypes)
        
        # Check for empty DataFrame
        if prophet_df.empty:
            raise ValueError("No valid data available for prediction after cleaning.")
        
        # Initialize and fit Prophet model
        model = Prophet(daily_seasonality=True)
        model.fit(prophet_df)
        
        # Create future dates for prediction
        future = model.make_future_dataframe(periods=days_ahead)
        forecast = model.predict(future)
        
        # Extract forecast data
        forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days_ahead)
        forecast_data['ds'] = forecast_data['ds'].dt.strftime('%Y-%m-%d')
        
        # Round the predictions to 2 decimal places
        for col in ['yhat', 'yhat_lower', 'yhat_upper']:
            forecast_data[col] = forecast_data[col].round(2)
            
        forecast_json = forecast_data.to_dict(orient='records')
        
        return {
            'forecast': forecast_json
        }
    except Exception as e:
        raise Exception(f"Error in AI prediction: {str(e)}")

# Test code
if __name__ == "__main__":
    try:
        ticker = "VAS.AX"
        print(f"Predicting future prices for {ticker}...")
        result = predict_future(ticker)
        print("\nAI Prediction Result:", result)
    except Exception as e:
        print("Error in prediction:", e)