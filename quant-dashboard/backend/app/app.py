# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from main_strategy import EnhancedQuantStrategy

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    ticker = data.get('ticker', 'VAS.AX')
    monthly_target = data.get('monthly_target', 2000)
    
    try:
        strategy = EnhancedQuantStrategy(ticker=ticker, monthly_target=monthly_target)
        results = strategy.calculate_recommendation()
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)