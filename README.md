# PriceWise – Smart Price Comparison & Price Tracking Platform

An intelligent, full-stack price intelligence and tracking web platform designed for consumers to effortlessly compare products across multiple major e-commerce retailers, monitor price drop trends, and receive smart deal recommendations.

> **Academic Project & Demonstration Notice:**  
> PriceWise is an educational prototype built for college project demonstration and evaluation. The displayed prices, discounts, and store comparisons are sample demonstration data. PriceWise does not scrape proprietary live websites; it features a modular REST API architecture designed for production partner API integration.

---

## 🌟 Key Features

1. **Smart Typo-Tolerant Search**:
   - Powered by RapidFuzz and token-ratio similarity algorithms.
   - Handles severe misspellings (e.g., `clenis face wash` → *Clean & Clear Face Wash*, `colgat` → *Colgate*, `criket bat` → *Cricket Bat*, `shampu` → *Shampoo*, `headphnes` → *Headphones*).
   - Searches across product names, categories, descriptions, and keywords without hardcoded `if/else` typo rules.

2. **Product Link Search**:
   - Paste product URLs directly into the search bar.
   - Automatically parses slugs and path tokens, extracts keywords, and matches against local database catalog.

3. **Multi-Store Price Comparison**:
   - Real-time comparison across major retail stores: **Amazon**, **Flipkart**, **Meesho**, **Blinkit**, **Zepto**, **Myntra**, and **Nykaa**.
   - Automatic calculation of **Lowest Price**, **Average Price**, and **Potential Savings**.
   - Prominent **★ BEST PRICE** visual highlight on the cheapest store card.

4. **Interactive Historical Price Charts**:
   - Integrated with Chart.js.
   - Dynamic timeframe toggles: **30 Days**, **90 Days**, **6 Months**, and **1 Year**.
   - Interactive tooltips showing exact price on each date and store.

5. **Smart Price Insights**:
   - Contextual intelligence analyzing whether the current price is a good deal, fair price, or if the user should wait.
   - Calculates exact savings relative to the historical retail average.

6. **Product Tracking & Price Alerts**:
   - Pin and track products to watch list.
   - Set custom target price alerts with immediate notification triggers when target thresholds are reached.

7. **Responsive & Modern Design**:
   - Custom purple/amethyst aesthetic (`#10002B`, `#240046`, `#5A189A`, `#7B2CBF`, `#9D4EDD`, `#E0AAFF`).
   - Clean card-based layouts, mobile hamburger menu, accessible typography, and smooth transitions.
   - Automated image fallback protection to ensure zero broken icons.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+), Chart.js |
| **Backend** | Python 3, Flask, REST APIs (JSON) |
| **Database** | SQLite (`pricewise.db`) |
| **Fuzzy Matching** | RapidFuzz (`rapidfuzz.fuzz`) with token-set ratio fallback |
| **Development & Preview** | Node.js Express bridge (`server.ts`) + Vite middleware mode |
| **Deployment Target** | Replit / Any standard Python WSGI host |

---

## 📂 Project Structure

```
PriceWise/
│
├── app.py                     # Primary Flask REST API application
├── database.py                # SQLite schema creation and 65+ seed products
├── search_engine.py           # RapidFuzz similarity and URL keyword extraction
├── api_handler.py             # Core database query & business logic handlers
├── api_cli.py                 # CLI interface bridge for full-stack preview
├── requirements.txt           # Python dependencies (Flask, rapidfuzz)
├── pricewise.db               # SQLite database file
├── server.ts                  # Node.js dev server & API proxy
├── package.json               # Environment configuration
│
├── templates/
│   └── index.html             # Main Jinja2 frontend template for Flask
│
├── static/
│   ├── css/
│   │   └── style.css          # Amethyst design system & responsive styling
│   │
│   ├── js/
│   │   └── script.js          # Client-side dynamic fetch, DOM & Chart.js logic
│   │
│   └── images/
│       ├── stores/            # Official vector SVG store logos
│       │   ├── amazon.svg
│       │   ├── flipkart.svg
│       │   ├── meesho.svg
│       │   ├── blinkit.svg
│       │   ├── zepto.svg
│       │   ├── myntra.svg
│       │   └── nykaa.svg
│       └── placeholder-product.svg # Automated fallback image asset
│
└── README.md                  # Comprehensive project documentation
```

---

## 🗄️ Database Architecture (`pricewise.db`)

The SQLite database contains 7 relational tables:

1. **`categories`**:
   - `id` (INTEGER PRIMARY KEY)
   - `name` (TEXT)
   - `slug` (TEXT)
   - `icon` (TEXT)
   - `description` (TEXT)

2. **`stores`**:
   - `id` (INTEGER PRIMARY KEY)
   - `name` (TEXT)
   - `logo` (TEXT)
   - `website` (TEXT)
   - `rating` (REAL)

3. **`products`**:
   - `id` (INTEGER PRIMARY KEY)
   - `name` (TEXT)
   - `category_id` (INTEGER REFERENCES categories)
   - `description` (TEXT)
   - `keywords` (TEXT)
   - `rating` (REAL)
   - `reviews` (INTEGER)
   - `image` (TEXT)
   - `created_at` (TIMESTAMP)

4. **`store_prices`**:
   - `id` (INTEGER PRIMARY KEY)
   - `product_id` (INTEGER REFERENCES products)
   - `store_id` (INTEGER REFERENCES stores)
   - `price` (REAL)
   - `original_price` (REAL)
   - `discount` (REAL)
   - `availability` (TEXT)
   - `delivery` (TEXT)
   - `product_url` (TEXT)
   - `updated_at` (TIMESTAMP)

5. **`price_history`**:
   - `id` (INTEGER PRIMARY KEY)
   - `product_id` (INTEGER REFERENCES products)
   - `store_id` (INTEGER REFERENCES stores)
   - `price` (REAL)
   - `recorded_at` (TIMESTAMP)

6. **`tracked_products`**:
   - `id` (INTEGER PRIMARY KEY)
   - `product_id` (INTEGER UNIQUE REFERENCES products)
   - `created_at` (TIMESTAMP)

7. **`price_alerts`**:
   - `id` (INTEGER PRIMARY KEY)
   - `product_id` (INTEGER REFERENCES products)
   - `target_price` (REAL)
   - `created_at` (TIMESTAMP)
   - `status` (TEXT)

---

## 🚀 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/search?q=<query>` | Fuzzy typo-tolerant search across products & URLs |
| `GET` | `/api/products/<id>` | Fetch detailed product metadata |
| `GET` | `/api/products/<id>/prices` | Compare multi-store prices, discounts & savings |
| `GET` | `/api/products/<id>/history?timeframe=30d` | Retrieve price points over 30d, 90d, 6m, 1y |
| `GET` | `/api/categories` | List all 7 categories with product counts |
| `GET` | `/api/categories/<id>/products` | Retrieve products by category |
| `POST` | `/api/track` | Track a product (`{"product_id": 1}`) |
| `DELETE` | `/api/track/<id>` | Untrack a product |
| `GET` | `/api/tracked` | Fetch all active tracked products |
| `POST` | `/api/alerts` | Create a target price alert (`{"product_id": 1, "target_price": 750}`) |
| `DELETE` | `/api/alerts/<id>` | Remove a price alert |
| `GET` | `/api/alerts` | List all active price alerts |

---

## 🧠 How Smart Search & Fuzzy Matching Works

Instead of rigid string matches or hardcoded typo tables, PriceWise uses a multi-stage scoring pipeline:

1. **URL Detection & Parsing**:
   - Detects whether input is a product web address.
   - Extracts path slugs, filters query parameters, and strips URL stop-words (`/dp/`, `product`, `online`, etc.) into keywords.

2. **RapidFuzz Scoring Pipeline**:
   - **Direct & Substring Match**: Exact word matches receive immediate boosts.
   - **Token Set Ratio**: Matches tokens regardless of word order (e.g., `face wash clean` matches `Clean & Clear Face Wash`).
   - **Weighted Levenshtein Similarity**: Calculates distance between query words and catalog tokens to tolerate typos (e.g., `clenis` → `clean`, `colgat` → `colgate`).
   - **Multi-Field Relevance**: Aggregates weighted scores across product name (45%), keywords (35%), category (20%), and descriptions.

3. **Dynamic Filtering**:
   - Normalizes scores on a 0–100+ scale.
   - Applies an adaptive cutoff so only genuinely relevant items are presented.

---

## 💻 How to Run the Project on Replit

### Step 1: Clone or Import
Upload or clone the repository to a new Python repl.

### Step 2: Install Dependencies
Open the Replit Shell and execute:
```bash
pip install -r requirements.txt
```

### Step 3: Initialize Database (Automatic on First Run)
Run `database.py` to seed sample products, store pricing, and price histories:
```bash
python database.py
```

### Step 4: Run Flask Web Server
Start the Flask application:
```bash
python app.py
```
The application will launch on port `5000` (or `PORT` environment variable) and render the web UI in Replit's webview.

---

## 🔮 Future Scope

1. **Live Merchant APIs**: Integrate verified affiliate and merchant partner APIs (e.g., Amazon Product Advertising API, Flipkart Affiliate API).
2. **Email & Push Webhooks**: Implement automated email delivery (via SendGrid / SMTP) when price alerts trigger.
3. **Barcode Scanning**: Add mobile camera barcode scanner (EAN/UPC) for instant in-store price comparisons.
4. **Predictive AI Price Forecasting**: Train ARIMA or regression models on historical time-series data to predict price dips before major sales.
