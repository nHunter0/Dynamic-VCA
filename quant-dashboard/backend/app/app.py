from flask import Flask, jsonify, request
from flask_cors import CORS
from main_strategy import EnhancedQuantStrategy
from ai.predict_future import predict_future
from ai.predict_future_advanced import predict_future_advanced_parallel
from ai.backtest import backtest_model

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    ticker = data.get('ticker', 'VAS.AX')
    monthly_target = data.get('monthly_target', 2000)
    total_target = data.get('total_target', 10000)

    app.logger.info("Received data for analyze: %s", data)

    try:
        # Initialize strategy and calculate recommendation
        strategy = EnhancedQuantStrategy(
            ticker=ticker,
            monthly_target=monthly_target,
            total_target=total_target
        )
        results = strategy.calculate_recommendation()
        
        app.logger.info("Analysis result: %s", results)
        
        return jsonify(results)
    except Exception as e:
        app.logger.error("Error in /api/analyze: %s", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    ticker = data.get("ticker", "VAS.AX")

    app.logger.info("Received data for prediction: %s", data)

    try:
        prediction = predict_future(ticker)
        app.logger.info("Prediction result: %s", prediction)
        return jsonify(prediction)
    except Exception as e:
        app.logger.error("Error in /api/predict: %s", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict-advanced', methods=['POST'])
def predict_advanced():
    data = request.get_json()
    ticker = data.get("ticker", "VAS.AX")
    days_ahead = data.get("days_ahead", 30)

    app.logger.info("Received data for advanced prediction: %s", data)

    try:
        prediction = predict_future_advanced_parallel(ticker, days_ahead)
        app.logger.info("Advanced prediction result: %s", prediction)
        return jsonify(prediction)
    except Exception as e:
        app.logger.error("Error in /api/predict-advanced: %s", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/backtest', methods=['POST'])
def backtest():
    data = request.get_json()
    ticker = data.get("ticker", "VAS.AX")
    train_period = data.get("train_period", "5y")
    test_days = data.get("test_days", 30)

    app.logger.info("Received data for backtesting: %s", data)

    try:
        results = backtest_model(ticker, train_period, test_days)
        app.logger.info("Backtest results: %s", results)
        return jsonify(results)
    except Exception as e:
        app.logger.error("Error in /api/backtest: %s", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)


