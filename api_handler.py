"""
PriceWise - Core API Data Handler
Queries SQLite database (pricewise.db) and executes business logic for prices,
discounts, best deals, history trends, tracking, and alerts.
"""

import sqlite3
import json
import os
from datetime import datetime, timedelta
from search_engine import score_product, is_url, extract_keywords_from_url

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pricewise.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def search_products(query, limit=20):
    if not query or not query.strip():
        return {"results": [], "query": query}

    query_str = query.strip()
    is_link = is_url(query_str)
    search_terms = extract_keywords_from_url(query_str) if is_link else query_str

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT p.id, p.name, p.category_id, p.description, p.keywords, p.rating, p.reviews, p.image,
               c.name as category,
               MIN(sp.price) as lowest_price,
               MAX(sp.price) as highest_price,
               AVG(sp.price) as average_price,
               COUNT(sp.id) as stores_count
        FROM products p
        JOIN categories c ON p.category_id = c.id
        LEFT JOIN store_prices sp ON p.id = sp.product_id
        GROUP BY p.id
    ''')
    rows = cursor.fetchall()
    conn.close()

    scored = []
    for r in rows:
        p_dict = dict(r)
        s = score_product(search_terms, p_dict)
        if s >= 60: # Crisp threshold for relevant results
            p_dict['score'] = round(s, 1)
            p_dict['lowest_price'] = round(p_dict['lowest_price'] or 0)
            p_dict['highest_price'] = round(p_dict['highest_price'] or 0)
            p_dict['average_price'] = round(p_dict['average_price'] or 0)
            p_dict['is_url_search'] = is_link
            scored.append(p_dict)

    scored.sort(key=lambda x: x['score'], reverse=True)

    # Dynamic cutoff based on top result
    if scored:
        top_score = scored[0]['score']
        # If top score is strong, cut off distant low scores
        min_relative_score = max(65.0, top_score * 0.40)
        filtered = [x for x in scored if x['score'] >= min_relative_score]
        if filtered:
            scored = filtered
    return {
        "results": scored[:limit],
        "query": query_str,
        "parsed_keywords": search_terms if is_link else None,
        "is_url": is_link,
        "total": len(scored)
    }

def get_product(product_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT p.id, p.name, p.category_id, p.description, p.keywords, p.rating, p.reviews, p.image,
               c.name as category,
               MIN(sp.price) as lowest_price,
               MAX(sp.price) as highest_price,
               AVG(sp.price) as average_price
        FROM products p
        JOIN categories c ON p.category_id = c.id
        LEFT JOIN store_prices sp ON p.id = sp.product_id
        WHERE p.id = ?
        GROUP BY p.id
    ''', (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None

    p = dict(row)
    p['lowest_price'] = round(p['lowest_price'] or 0)
    p['highest_price'] = round(p['highest_price'] or 0)
    p['average_price'] = round(p['average_price'] or 0)
    p['potential_saving'] = max(0, p['highest_price'] - p['lowest_price'])
    return p

def get_product_prices(product_id):
    product = get_product(product_id)
    if not product:
        return None

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT sp.id, sp.price, sp.original_price, sp.discount, sp.availability, sp.delivery, sp.product_url,
               s.id as store_id, s.name as store, s.logo, s.website, s.rating as store_rating
        FROM store_prices sp
        JOIN stores s ON sp.store_id = s.id
        WHERE sp.product_id = ?
        ORDER BY sp.price ASC
    ''', (product_id,))
    rows = cursor.fetchall()
    conn.close()

    stores_list = []
    lowest_price = product['lowest_price']
    highest_price = product['highest_price']
    avg_price = product['average_price']

    for r in rows:
        item = dict(r)
        item['price'] = round(item['price'])
        item['original_price'] = round(item['original_price'])
        item['is_best_price'] = (item['price'] == lowest_price)
        stores_list.append(item)

    potential_saving = max(0, highest_price - lowest_price)

    return {
        "product_id": product['id'],
        "product": product['name'],
        "category": product['category'],
        "image": product['image'],
        "rating": product['rating'],
        "reviews": product['reviews'],
        "description": product['description'],
        "lowest_price": lowest_price,
        "highest_price": highest_price,
        "average_price": avg_price,
        "potential_saving": potential_saving,
        "stores": stores_list
    }

def get_product_history(product_id, timeframe='30d'):
    product = get_product(product_id)
    if not product:
        return None

    days_map = {
        '30d': 30,
        '90d': 90,
        '6m': 180,
        '1y': 365
    }
    days = days_map.get(timeframe, 30)
    cutoff = datetime.now() - timedelta(days=days)
    cutoff_str = cutoff.strftime('%Y-%m-%d %H:%M:%S')

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT ph.price, ph.recorded_at, s.name as store, s.logo
        FROM price_history ph
        JOIN stores s ON ph.store_id = s.id
        WHERE ph.product_id = ? AND ph.recorded_at >= ?
        ORDER BY ph.recorded_at ASC
    ''', (product_id, cutoff_str))
    rows = cursor.fetchall()
    conn.close()

    history = []
    prices = []
    for r in rows:
        history.append({
            "price": round(r['price']),
            "recorded_at": r['recorded_at'],
            "date": r['recorded_at'].split(' ')[0],
            "store": r['store'],
            "logo": r['logo']
        })
        prices.append(round(r['price']))

    lowest = min(prices) if prices else product['lowest_price']
    highest = max(prices) if prices else product['highest_price']
    average = round(sum(prices) / len(prices)) if prices else product['average_price']

    current_lowest = product['lowest_price']
    diff_from_avg = average - current_lowest

    if diff_from_avg > 0:
        insight = f"Great time to buy! The current lowest price is ₹{diff_from_avg:,} below the average price."
        badge = "Good Deal"
    elif diff_from_avg == 0:
        insight = "The current price is right around the historical average."
        badge = "Fair Price"
    else:
        insight = f"Price is currently ₹{abs(diff_from_avg):,} higher than recent lowest dips. You may want to set a price alert."
        badge = "Consider Waiting"

    return {
        "product_id": product_id,
        "product": product['name'],
        "timeframe": timeframe,
        "history": history,
        "lowest": lowest,
        "highest": highest,
        "average": average,
        "current_lowest": current_lowest,
        "potential_saving": product['potential_saving'],
        "insight": insight,
        "badge": badge
    }

def get_categories():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT c.id, c.name, c.slug, c.icon, c.description, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id
        ORDER BY c.id ASC
    ''')
    cats = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"categories": cats}

def get_category_products(category_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, description FROM categories WHERE id = ?', (category_id,))
    cat = cursor.fetchone()
    if not cat:
        conn.close()
        return None

    cursor.execute('''
        SELECT p.id, p.name, p.category_id, p.description, p.keywords, p.rating, p.reviews, p.image,
               c.name as category,
               MIN(sp.price) as lowest_price,
               MAX(sp.price) as highest_price,
               AVG(sp.price) as average_price,
               COUNT(sp.id) as stores_count
        FROM products p
        JOIN categories c ON p.category_id = c.id
        LEFT JOIN store_prices sp ON p.id = sp.product_id
        WHERE p.category_id = ?
        GROUP BY p.id
        ORDER BY p.rating DESC, p.reviews DESC
    ''', (category_id,))
    products = []
    for r in cursor.fetchall():
        d = dict(r)
        d['lowest_price'] = round(d['lowest_price'] or 0)
        d['highest_price'] = round(d['highest_price'] or 0)
        d['average_price'] = round(d['average_price'] or 0)
        products.append(d)
    conn.close()

    return {
        "category": dict(cat),
        "products": products
    }

def track_product(product_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('INSERT OR IGNORE INTO tracked_products (product_id) VALUES (?)', (product_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Product is now tracked", "product_id": product_id}

def untrack_product(product_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tracked_products WHERE product_id = ?', (product_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Product untracked", "product_id": product_id}

def get_tracked_products():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT tp.id as track_id, tp.created_at as tracked_since,
               p.id, p.name, p.image, p.rating, p.reviews, c.name as category,
               MIN(sp.price) as lowest_price,
               MAX(sp.price) as highest_price,
               AVG(sp.price) as average_price
        FROM tracked_products tp
        JOIN products p ON tp.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        LEFT JOIN store_prices sp ON p.id = sp.product_id
        GROUP BY tp.id
        ORDER BY tp.created_at DESC
    ''')
    rows = cursor.fetchall()
    tracked = []
    for r in rows:
        d = dict(r)
        d['lowest_price'] = round(d['lowest_price'] or 0)
        d['highest_price'] = round(d['highest_price'] or 0)
        d['average_price'] = round(d['average_price'] or 0)
        # Calculate recent drop vs average
        d['price_change'] = round(d['lowest_price'] - d['average_price'])
        d['status'] = "Tracking Active"
        tracked.append(d)
    conn.close()
    return {"tracked_products": tracked, "count": len(tracked)}

def create_price_alert(product_id, target_price):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO price_alerts (product_id, target_price, status)
        VALUES (?, ?, 'Active')
    ''', (product_id, target_price))
    alert_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"success": True, "alert_id": alert_id, "message": f"Alert set for target price ₹{target_price:,}"}

def delete_price_alert(alert_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM price_alerts WHERE id = ?', (alert_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Alert removed"}

def get_price_alerts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT pa.id as alert_id, pa.target_price, pa.status, pa.created_at,
               p.id as product_id, p.name, p.image, c.name as category,
               MIN(sp.price) as lowest_price
        FROM price_alerts pa
        JOIN products p ON pa.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        LEFT JOIN store_prices sp ON p.id = sp.product_id
        GROUP BY pa.id
        ORDER BY pa.created_at DESC
    ''')
    rows = cursor.fetchall()
    alerts = []
    for r in rows:
        d = dict(r)
        d['lowest_price'] = round(d['lowest_price'] or 0)
        if d['lowest_price'] <= d['target_price']:
            d['status'] = "Target Reached!"
        alerts.append(d)
    conn.close()
    return {"alerts": alerts, "count": len(alerts)}
