# test.py

from AI.predict_future_advanced import predict_future_advanced_parallel

if __name__ == "__main__":
    try:
        ticker = "VAS.AX"
        days_ahead = 30
        print(f"Predicting future prices for {ticker} using advanced LSTM model...")
        result = predict_future_advanced_parallel(ticker, days_ahead)
        print("\nAdvanced AI Prediction Result:")
        for forecast in result['forecast']:
            print(forecast)
    except Exception as e:
        print("Error in advanced prediction:", e)
