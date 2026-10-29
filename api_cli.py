"""
PriceWise - CLI bridge for Node.js / Express integration
Allows server.ts to call Python backend logic directly using the real SQLite database and RapidFuzz engine.
"""

import sys
import json
import api_handler

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No action specified"}))
        return

    action = sys.argv[1]

    try:
        if action == "search":
            q = sys.argv[2] if len(sys.argv) > 2 else ""
            res = api_handler.search_products(q)
            print(json.dumps(res))
        elif action == "get_product":
            pid = int(sys.argv[2])
            res = api_handler.get_product(pid)
            print(json.dumps(res or {"error": "Not found"}))
        elif action == "get_prices":
            pid = int(sys.argv[2])
            res = api_handler.get_product_prices(pid)
            print(json.dumps(res or {"error": "Not found"}))
        elif action == "get_history":
            pid = int(sys.argv[2])
            tf = sys.argv[3] if len(sys.argv) > 3 else "30d"
            res = api_handler.get_product_history(pid, tf)
            print(json.dumps(res or {"error": "Not found"}))
        elif action == "get_categories":
            res = api_handler.get_categories()
            print(json.dumps(res))
        elif action == "get_category_products":
            cid = int(sys.argv[2])
            res = api_handler.get_category_products(cid)
            print(json.dumps(res or {"error": "Category not found"}))
        elif action == "track":
            pid = int(sys.argv[2])
            res = api_handler.track_product(pid)
            print(json.dumps(res))
        elif action == "untrack":
            pid = int(sys.argv[2])
            res = api_handler.untrack_product(pid)
            print(json.dumps(res))
        elif action == "get_tracked":
            res = api_handler.get_tracked_products()
            print(json.dumps(res))
        elif action == "create_alert":
            pid = int(sys.argv[2])
            target = float(sys.argv[3])
            res = api_handler.create_price_alert(pid, target)
            print(json.dumps(res))
        elif action == "delete_alert":
            aid = int(sys.argv[2])
            res = api_handler.delete_price_alert(aid)
            print(json.dumps(res))
        elif action == "get_alerts":
            res = api_handler.get_price_alerts()
            print(json.dumps(res))
        else:
            print(json.dumps({"error": f"Unknown action: {action}"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
