from flask import Flask, jsonify, request
from flask_cors import CORS
from main_strategy import EnhancedQuantStrategy
from AI.predict_future import predict_future
from AI.predict_future_advanced import predict_future_advanced_parallel
from AI.backtest import backtest_model
from summary_generator import AnalysisSummary

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    ticker = data.get('ticker', 'VAS.AX')
    monthly_target = data.get('monthly_target', 2000)
    total_target = data.get('total_target', 10000)

    try:
        strategy = EnhancedQuantStrategy(
            ticker=ticker,
            monthly_target=monthly_target,
            total_target=total_target
        )
        results = strategy.calculate_recommendation()
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    ticker = data.get("ticker", "VAS.AX")
    
    try:
        market_data = EnhancedQuantStrategy(ticker=ticker).calculate_recommendation()
        prediction = predict_future(ticker)
        
        # Generate summary
        summary = AnalysisSummary.generate_combined_summary(
            market_data=market_data,
            ai_prediction=prediction['forecast']
        )
        
        return jsonify({
            'forecast': prediction['forecast'],
            'summary': summary
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict-advanced', methods=['POST'])
def predict_advanced():
    data = request.get_json()
    ticker = data.get("ticker", "VAS.AX")
    days_ahead = data.get("days_ahead", 30)
    
    try:
        market_data = EnhancedQuantStrategy(ticker=ticker).calculate_recommendation()
        prediction = predict_future_advanced_parallel(ticker, days_ahead)
        
        # Generate summary
        summary = AnalysisSummary.generate_combined_summary(
            market_data=market_data,
            ai_prediction=prediction['forecast']
        )
        
        return jsonify({
            'forecast': prediction['forecast'],
            'summary': summary
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/backtest', methods=['POST'])
def backtest():
    data = request.get_json()
    ticker = data.get("ticker", "VAS.AX")
    train_period = data.get("train_period", "5y")
    test_days = data.get("test_days", 30)

    try:
        market_data = EnhancedQuantStrategy(ticker=ticker).calculate_recommendation()
        backtest_results = backtest_model(ticker, train_period, test_days)
        
        # Use only the advanced model prediction
        prediction = predict_future_advanced_parallel(ticker, days_ahead=test_days)
        
        # Generate summary with advanced model predictions
        summary = AnalysisSummary.generate_combined_summary(
            market_data=market_data,
            ai_prediction=prediction['forecast'],
            backtest_data=backtest_results
        )
        
        return jsonify({
            'metrics': backtest_results['metrics'],
            'comparison_df': backtest_results['comparison_df'],
            'summary': summary
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)