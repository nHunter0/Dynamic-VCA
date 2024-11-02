import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers import Adam
from multiprocessing import Pool

def predict_future_advanced_parallel(ticker: str, days_ahead: int = 30):
    try:
        # Fetch and prepare data (same as before)
        data = yf.download(ticker, period='5y')
        data = data.reset_index()
        
        # Prepare feature engineering, technical indicators, scaling, etc.
        data['Date'] = pd.to_datetime(data['Date'])
        data.set_index('Date', inplace=True)
        
        data['MA20'] = data['Close'].rolling(window=20).mean()
        data['MA50'] = data['Close'].rolling(window=50).mean()
        data['RSI'] = calculate_rsi(data['Close'], periods=14)
        data['VOL_MA'] = data['Volume'].rolling(window=20).mean()
        
        features = ['Close', 'MA20', 'MA50', 'RSI', 'VOL_MA']
        feature_data = data[features].dropna()
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(feature_data)
        
        prediction_days = 60
        x_train, y_train = [], []
        
        for x in range(prediction_days, len(scaled_data)):
            x_train.append(scaled_data[x - prediction_days:x])
            y_train.append(scaled_data[x, 0])  # Predict Close price
            
        x_train, y_train = np.array(x_train), np.array(y_train)
        
        # Train models in parallel
        n_models = 5
        with Pool(n_models) as pool:
            results = pool.starmap(train_lstm_model, [(x_train, y_train, x_train.shape[1:]) for _ in range(n_models)])
        
        # Collect models and make predictions
        predictions = []
        test_data = scaled_data[-prediction_days:]
        current_batch = test_data.reshape((1, prediction_days, len(features)))
        
        for model in results:
            model_predictions = []
            current_batch_model = current_batch.copy()
            for _ in range(days_ahead):
                pred = model.predict(current_batch_model, verbose=0)[0]
                model_predictions.append(pred)
                new_row = current_batch_model[0, -1:].copy()
                new_row[0, 0] = pred  # Update Close price
                current_batch_model = np.append(current_batch_model[:, 1:], [new_row], axis=1)
            predictions.append(model_predictions)
        
        # Calculate mean and confidence intervals
        predictions = np.array(predictions)
        mean_predictions = np.mean(predictions, axis=0)
        std_predictions = np.std(predictions, axis=0)
        
        price_scaler = MinMaxScaler().fit(data['Close'].values.reshape(-1, 1))
        mean_prices = price_scaler.inverse_transform(mean_predictions.reshape(-1, 1))
        
        lower_bound = mean_predictions - 2 * std_predictions
        upper_bound = mean_predictions + 2 * std_predictions
        lower_prices = price_scaler.inverse_transform(lower_bound.reshape(-1, 1))
        upper_prices = price_scaler.inverse_transform(upper_bound.reshape(-1, 1))
        
        last_date = data.index[-1]
        future_dates = pd.date_range(
            start=last_date + pd.Timedelta(days=1),
            periods=days_ahead,
            freq='B'
        )
        
        forecast_data = pd.DataFrame({
            'ds': future_dates.strftime('%Y-%m-%d'),
            'yhat': mean_prices.flatten().round(2),
            'yhat_lower': lower_prices.flatten().round(2),
            'yhat_upper': upper_prices.flatten().round(2)
        })
        
        return {
            'forecast': forecast_data.to_dict('records')
        }
        
    except Exception as e:
        raise Exception(f"Error in advanced AI prediction: {str(e)}")

def calculate_rsi(prices, periods=14):
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(100, return_sequences=True, input_shape=input_shape),
        Dropout(0.3),
        LSTM(100, return_sequences=True),
        Dropout(0.3),
        LSTM(100),
        Dropout(0.3),
        Dense(1)
    ])
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='mean_squared_error'
    )
    return model

def train_lstm_model(x_train, y_train, input_shape):
    model = build_lstm_model(input_shape)
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    model.fit(x_train, y_train, epochs=100, batch_size=32, validation_split=0.2, callbacks=[early_stopping], verbose=0)
    return model

# Test code
if __name__ == "__main__":
    try:
        ticker = "VAS.AX"
        print(f"Predicting future prices for {ticker}...")
        result = predict_future_advanced_parallel(ticker)
        print("\nAI Prediction Result:", result)
    except Exception as e:
        print("Error in prediction:", e)
