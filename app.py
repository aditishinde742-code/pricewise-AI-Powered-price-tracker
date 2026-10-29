"""
PriceWise - Smart Price Comparison & Price Tracking Platform
Python Flask Application Backend
"""

import os
from flask import Flask, request, jsonify, render_template, send_from_directory
from database import init_db
import api_handler

app = Flask(__name__, template_folder='templates', static_folder='static')

# Ensure database is initialized
init_db()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

# 1. Search products
@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({"results": [], "query": "", "message": "Query parameter 'q' is required"}), 200
    try:
        data = api_handler.search_products(query)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e), "results": []}), 500

# 2. Product details
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = api_handler.get_product(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 3. Product store prices comparison
@app.route('/api/products/<int:product_id>/prices', methods=['GET'])
def get_prices(product_id):
    try:
        prices_data = api_handler.get_product_prices(product_id)
        if not prices_data:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(prices_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 4. Product price history
@app.route('/api/products/<int:product_id>/history', methods=['GET'])
def get_history(product_id):
    timeframe = request.args.get('timeframe', '30d')
    try:
        history_data = api_handler.get_product_history(product_id, timeframe)
        if not history_data:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(history_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 5. Categories list
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        return jsonify(api_handler.get_categories())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 6. Category products
@app.route('/api/categories/<int:category_id>/products', methods=['GET'])
def get_category_products(category_id):
    try:
        res = api_handler.get_category_products(category_id)
        if not res:
            return jsonify({"error": "Category not found"}), 404
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 7. Track product (POST)
@app.route('/api/track', methods=['POST'])
def track():
    payload = request.get_json(silent=True) or {}
    product_id = payload.get('product_id')
    if not product_id:
        return jsonify({"error": "product_id is required"}), 400
    try:
        res = api_handler.track_product(int(product_id))
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Untrack product
@app.route('/api/track/<int:product_id>', methods=['DELETE'])
def untrack(product_id):
    try:
        res = api_handler.untrack_product(product_id)
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 8. Get tracked products (GET)
@app.route('/api/tracked', methods=['GET'])
def get_tracked():
    try:
        return jsonify(api_handler.get_tracked_products())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 9. Create price alert (POST)
@app.route('/api/alerts', methods=['POST'])
def create_alert():
    payload = request.get_json(silent=True) or {}
    product_id = payload.get('product_id')
    target_price = payload.get('target_price')

    if not product_id or target_price is None:
        return jsonify({"error": "product_id and target_price are required"}), 400

    try:
        res = api_handler.create_price_alert(int(product_id), float(target_price))
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete price alert
@app.route('/api/alerts/<int:alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    try:
        res = api_handler.delete_price_alert(alert_id)
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 10. Get price alerts (GET)
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    try:
        return jsonify(api_handler.get_price_alerts())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
