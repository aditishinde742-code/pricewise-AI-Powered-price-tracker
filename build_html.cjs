const fs = require('fs');
const path = require('path');

const css = fs.readFileSync('static/css/style.css', 'utf8');

// The 7 categories
const categoriesData = [
  { id: 1, name: "Electronics", slug: "electronics", icon: "💻", count: 11 },
  { id: 2, name: "Beauty & Personal Care", slug: "beauty-personal-care", icon: "✨", count: 9 },
  { id: 3, name: "Fragrance", slug: "fragrance", icon: "🌸", count: 7 },
  { id: 4, name: "Household", slug: "household", icon: "🏠", count: 8 },
  { id: 5, name: "Grocery", slug: "grocery", icon: "🛒", count: 12 },
  { id: 6, name: "Sports", slug: "sports", icon: "🏏", count: 8 },
  { id: 7, name: "Fashion", slug: "fashion", icon: "👕", count: 10 }
];

// Pre-rendered categories HTML
const categoriesHtml = categoriesData.map(cat => `
        <div class="category-card ${cat.id === 1 ? 'active' : ''}" data-id="${cat.id}" onclick="selectCategory(${cat.id}, this)">
          <div class="category-icon-box">${cat.icon}</div>
          <div class="category-name">${cat.name}</div>
          <div class="category-count">${cat.count} Products</div>
        </div>`).join('\n');

// Pre-rendered search results HTML (Using real authentic product photography)
const searchResultsHtml = `
      <div class="results-header-info" id="resultsCountText">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 12px;">
          <div>
            <div class="results-count-text">
              <span class="results-dot-pink"></span>
              <span>Search Results for "phone"</span>
            </div>
            <div class="results-subtext">Click on any item above to load store comparison rates, dynamic discounts, and price history.</div>
          </div>
          <div class="results-total-badge">Showing <strong>3</strong> items</div>
        </div>
      </div>

      <div class="products-grid" id="resultsGrid">
        <!-- Card 1: Apple iPhone 15 (Active Selected) -->
        <div class="product-card active-selected" data-id="1" onclick="selectProduct(1, true)">
          <div class="product-card-thumb-wrapper">
            <img class="product-card-thumb" src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80" alt="Apple iPhone 15" onerror="handleImageError(this)" loading="lazy" />
            <span class="product-card-save-badge">Save ₹1,500</span>
          </div>
          <div class="product-card-content">
            <div>
              <div class="product-card-cat-label">ELECTRONICS</div>
              <h4 class="product-card-title">Apple iPhone 15</h4>
              <div class="product-card-rating">
                <span class="star-rating-pill">★ 4.8</span>
                <span>(14,200)</span>
              </div>
            </div>
            <div class="product-card-bottom-row">
              <div class="price-col">
                <span class="price-col-from">FROM</span>
                <span class="product-card-price-val">₹58,999</span>
              </div>
              <button class="btn-card-action btn-card-viewing">Viewing →</button>
            </div>
          </div>
        </div>

        <!-- Card 2: Samsung Galaxy Phone -->
        <div class="product-card" data-id="2" onclick="selectProduct(2, true)">
          <div class="product-card-thumb-wrapper">
            <img class="product-card-thumb" src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80" alt="Samsung Galaxy S24 Ultra" onerror="handleImageError(this)" loading="lazy" />
            <span class="product-card-save-badge">Save ₹15,000</span>
          </div>
          <div class="product-card-content">
            <div>
              <div class="product-card-cat-label">ELECTRONICS</div>
              <h4 class="product-card-title">Samsung Galaxy S24 Ultra</h4>
              <div class="product-card-rating">
                <span class="star-rating-pill">★ 4.7</span>
                <span>(8,940)</span>
              </div>
            </div>
            <div class="product-card-bottom-row">
              <div class="price-col">
                <span class="price-col-from">FROM</span>
                <span class="product-card-price-val">₹1,18,499</span>
              </div>
              <button class="btn-card-action btn-card-compare">Compare →</button>
            </div>
          </div>
        </div>

        <!-- Card 3: Sony WH-1000XM5 Headphones -->
        <div class="product-card" data-id="7" onclick="selectProduct(7, true)">
          <div class="product-card-thumb-wrapper">
            <img class="product-card-thumb" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" alt="Sony WH-1000XM5 Headphones" onerror="handleImageError(this)" loading="lazy" />
            <span class="product-card-save-badge">Save ₹9,000</span>
          </div>
          <div class="product-card-content">
            <div>
              <div class="product-card-cat-label">ELECTRONICS</div>
              <h4 class="product-card-title">Sony WH-1000XM5 Headphones</h4>
              <div class="product-card-rating">
                <span class="star-rating-pill">★ 4.8</span>
                <span>(9,150)</span>
              </div>
            </div>
            <div class="product-card-bottom-row">
              <div class="price-col">
                <span class="price-col-from">FROM</span>
                <span class="product-card-price-val">₹25,990</span>
              </div>
              <button class="btn-card-action btn-card-compare">Compare →</button>
            </div>
          </div>
        </div>
      </div>`;

// Authentic brand SVGs embedded directly for 100% resilient rendering in any deployment
const STORE_SVGS = {
  amazon: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><path d="M22 24.5C18.2 24.5 15.2 23.2 15.2 20.3C15.2 17.5 17.7 16.3 21.8 16.3C23.6 16.3 24.8 16.6 25.5 16.9V16.3C25.5 14.8 24.3 13.9 22.3 13.9C20.6 13.9 18.9 14.4 17.6 15.2L16.4 13.2C18 12.1 20.4 11.5 22.8 11.5C26.5 11.5 28.5 13.3 28.5 16.6V24.2H25.6V22.6C24.7 23.8 23.3 24.5 22 24.5ZM22.3 22.3C23.7 22.3 24.8 21.4 25.5 20.2V18.7C24.8 18.3 23.8 18.1 22.6 18.1C20.2 18.1 18.5 18.9 18.5 20.3C18.5 21.5 19.6 22.3 22.3 22.3Z" fill="#131921"/><text x="32" y="23" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#131921" letter-spacing="-0.5">amazon</text><path d="M18 29.5C28 35.5 58 35.5 78 28.5" stroke="#FF9900" stroke-width="2.6" stroke-linecap="round"/><path d="M74 26.5L78.5 28.8L76 33" stroke="#FF9900" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  flipkart: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><rect x="6" y="8" width="24" height="24" rx="4" fill="#2874F0"/><path d="M15 14H23V17.5H18.5V19.5H22.5V23H18.5V28H15V14Z" fill="#FFE500"/><text x="36" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="15" fill="#2874F0" letter-spacing="-0.3">Flipkart</text></svg>`,
  blinkit: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><rect width="112" height="34" rx="6" fill="#F8CB46" y="3" x="4"/><rect x="10" y="8" width="24" height="24" rx="5" fill="#0C831F"/><text x="16" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="17" fill="#FFFFFF">b</text><text x="40" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="#0C831F" letter-spacing="-0.3">blinkit</text></svg>`,
  meesho: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><rect x="6" y="8" width="24" height="24" rx="6" fill="#F43397"/><path d="M12 25V15L16 21L20 15V25" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="36" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="15" fill="#5A189A" letter-spacing="-0.3">meesho</text></svg>`
};

// Pre-rendered store cards for iPhone 15
const storeCardsHtml = `
      <div class="store-card best-price-card">
        <span class="badge-pill badge-best-price store-card-badge">★ BEST PRICE</span>
        <div>
          <div class="store-card-top">
            <div class="store-logo-wrapper" title="Amazon">
              ${STORE_SVGS.amazon}
            </div>
            <span class="store-rating-badge">★ 4.8</span>
          </div>
          <div class="store-price-block">
            <div class="store-current-price">₹58,999</div>
            <div class="store-orig-price-row">
              <span class="store-orig-price">₹69,900</span>
              <span class="store-discount-badge">16% OFF</span>
            </div>
          </div>
          <div class="store-logistics">
            <div class="stock-indicator">
              <span class="stock-dot"></span>
              <span>In Stock</span>
            </div>
            <div class="delivery-text">Free · 2–3 days delivery</div>
          </div>
        </div>
        <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-deal">
          <span>Go to Amazon</span>
          <span>↗</span>
        </a>
      </div>

      <div class="store-card">
        <div>
          <div class="store-card-top">
            <div class="store-logo-wrapper" title="Flipkart">
              ${STORE_SVGS.flipkart}
            </div>
            <span class="store-rating-badge">★ 4.6</span>
          </div>
          <div class="store-price-block">
            <div class="store-current-price">₹59,499</div>
            <div class="store-orig-price-row">
              <span class="store-orig-price">₹69,900</span>
              <span class="store-discount-badge">15% OFF</span>
            </div>
          </div>
          <div class="store-logistics">
            <div class="stock-indicator">
              <span class="stock-dot"></span>
              <span>In Stock</span>
            </div>
            <div class="delivery-text">Free · 2–3 days delivery</div>
          </div>
        </div>
        <a href="https://flipkart.com" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-deal">
          <span>Go to Flipkart</span>
          <span>↗</span>
        </a>
      </div>

      <div class="store-card">
        <div>
          <div class="store-card-top">
            <div class="store-logo-wrapper" title="Blinkit">
              ${STORE_SVGS.blinkit}
            </div>
            <span class="store-rating-badge">★ 4.7</span>
          </div>
          <div class="store-price-block">
            <div class="store-current-price">₹59,999</div>
            <div class="store-orig-price-row">
              <span class="store-orig-price">₹69,900</span>
              <span class="store-discount-badge">14% OFF</span>
            </div>
          </div>
          <div class="store-logistics">
            <div class="stock-indicator">
              <span class="stock-dot"></span>
              <span>In Stock</span>
            </div>
            <div class="delivery-text">10–15 mins delivery</div>
          </div>
        </div>
        <a href="https://blinkit.com" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-deal">
          <span>Go to Blinkit</span>
          <span>↗</span>
        </a>
      </div>

      <div class="store-card">
        <div>
          <div class="store-card-top">
            <div class="store-logo-wrapper" title="Meesho">
              ${STORE_SVGS.meesho}
            </div>
            <span class="store-rating-badge">★ 4.3</span>
          </div>
          <div class="store-price-block">
            <div class="store-current-price">₹60,499</div>
            <div class="store-orig-price-row">
              <span class="store-orig-price">₹69,900</span>
              <span class="store-discount-badge">13% OFF</span>
            </div>
          </div>
          <div class="store-logistics">
            <div class="stock-indicator">
              <span class="stock-dot"></span>
              <span>In Stock</span>
            </div>
            <div class="delivery-text">Free · 3–4 days delivery</div>
          </div>
        </div>
        <a href="https://meesho.com" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-deal">
          <span>Go to Meesho</span>
          <span>↗</span>
        </a>
      </div>`;

// Client script content
const clientJs = fs.readFileSync('static/js/script.js', 'utf8');

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PriceWise – Smart Price Comparison & Price Tracking Platform</title>
  <meta name="description" content="Compare prices across multiple stores, track price changes, get smart price drop alerts, and discover the right time to buy." />
  <meta property="og:title" content="PriceWise – Smart Price Comparison & Price Tracking Platform" />
  <meta property="og:description" content="Compare prices across multiple stores, track price changes, get smart price drop alerts, and discover the right time to buy." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

  <!-- Complete Inlined Theme Stylesheet -->
  <style id="pricewise-styles">
${css}
  </style>
</head>
<body>

  <!-- ============================================================
       TOP ANNOUNCEMENT BAR
       ============================================================ -->
  <div class="announcement-bar">
    <span class="announcement-dot"></span>
    <span>A smarter way to shop starts with knowing the price</span>
    <a href="#productComparisonSection" class="announcement-link">See how it works ↗</a>
  </div>

  <!-- ============================================================
       NAVBAR (MATCHES SCREENSHOT WITH DARK THEME)
       ============================================================ -->
  <nav class="navbar">
    <div class="container nav-container">
      <a href="/" class="brand-wrapper">
        <div class="brand-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </div>
        <div class="brand-info">
          <div class="brand-title-row">
            <span class="brand-name">Price<span class="brand-name-purple">Wise</span></span>
            <span class="brand-pro-badge">PRO</span>
          </div>
          <span class="brand-subtext">Smart Price Intelligence</span>
        </div>
      </a>

      <ul class="nav-links" id="navLinks">
        <li><a href="#hero" class="nav-link-btn active">Home</a></li>
        <li>
          <a href="#productComparisonSection" class="nav-link-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            <span>Compare</span>
          </a>
        </li>
        <li><a href="#priceHistorySection" class="nav-link-btn">Price History</a></li>
        <li>
          <a href="#categoriesSection" class="nav-link-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            <span>Categories</span>
          </a>
        </li>
        <li>
          <a href="#priceHistorySection" class="nav-link-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span>AI Insights</span>
          </a>
        </li>
      </ul>

      <div class="nav-actions">
        <button class="nav-pill-btn" onclick="handleOpenTrackedModal()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span>Tracked</span>
          <span class="pill-count-badge" id="trackedNavBadge">2</span>
        </button>
        <button class="nav-pill-btn" onclick="handleOpenAlertsListModal()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span>Alerts</span>
          <span class="pill-count-badge" id="alertsNavBadge">1</span>
        </button>
        <button class="nav-login-link" onclick="showToast('Demo Account: Guest User logged in', 'success')">Login</button>
        <button class="btn-get-started" onclick="document.getElementById('searchInput').focus(); selectProduct(1, true);">Get Started</button>
      </div>

      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle navigation">☰</button>
    </div>
  </nav>

  <!-- ============================================================
       HERO SECTION (MATCHES SCREENSHOT LAYOUT & GRAPHIC)
       ============================================================ -->
  <section class="hero-section" id="hero">
    <!-- Ambient glowing elliptical rings in background -->
    <div class="hero-bg-canvas">
      <div class="hero-glow-orb"></div>
      <svg class="hero-orbital-svg" viewBox="0 0 800 800" fill="none">
        <ellipse cx="400" cy="400" rx="370" ry="250" transform="rotate(-25 400 400)" stroke="rgba(199, 125, 255, 0.22)" stroke-width="1.5" stroke-dasharray="8 6" />
        <ellipse cx="400" cy="400" rx="310" ry="190" transform="rotate(20 400 400)" stroke="rgba(224, 170, 255, 0.16)" stroke-width="1.5" />
        <ellipse cx="400" cy="400" rx="220" ry="130" transform="rotate(-10 400 400)" stroke="rgba(157, 78, 221, 0.2)" stroke-width="1.2" />
      </svg>
    </div>

    <div class="container">
      <div class="hero-grid-layout">
        <!-- Left Hero Column -->
        <div class="hero-left-col">
          <div class="hero-pill-badge">
            <span>✦</span>
            <span>SMART PRICE INTELLIGENCE</span>
          </div>

          <h1 class="hero-main-title">
            Find the best price.
            <span class="hero-title-highlight">Every time.</span>
          </h1>

          <p class="hero-lead-text">
            Compare prices across stores, track the things you love, and know when it's the right time to buy.
          </p>

          <!-- Search Box Form -->
          <form class="hero-search-container" id="searchForm" onsubmit="event.preventDefault(); const q = document.getElementById('searchInput').value.trim(); if(q) performSearch(q);">
            <div class="hero-search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              type="text"
              id="searchInput"
              class="hero-search-input"
              placeholder="Search a product or paste a product link..."
              autocomplete="off"
              value="phone"
            />
            <button type="submit" class="hero-search-submit">
              <span>Search</span>
              <span>→</span>
            </button>
          </form>

          <!-- Try Suggestions Row -->
          <div class="hero-try-row">
            <span class="hero-try-label">Try:</span>
            <span class="try-item" onclick="handleEmptySearchClick('iPhone 15')">iPhone 15</span>
            <span class="try-separator">•</span>
            <span class="try-item" onclick="handleEmptySearchClick('Colgate')">Colgate</span>
            <span class="try-separator">•</span>
            <span class="try-item" onclick="handleEmptySearchClick('Bru Coffee')">Bru Coffee</span>
          </div>

          <!-- Trust Proof Row -->
          <div class="hero-trust-bar">
            <div class="store-avatars">
              <span class="avatar-circle avatar-r">R</span>
              <span class="avatar-circle avatar-a">A</span>
              <span class="avatar-circle avatar-m">M</span>
            </div>
            <div>
              <strong class="trust-bold-text">Simple, transparent comparisons.</strong>
              <span> Demo prices, clearly labeled.</span>
            </div>
          </div>
        </div>

        <!-- Right Hero Visual Column (iPhone Mockup + Floating Cards) -->
        <div class="hero-right-col">
          <div class="hero-visual-stage">
            <span class="sparkle-star star-1">✦</span>
            <span class="sparkle-star star-2">✦</span>

            <!-- Floating Card 1: Amazon Price Card -->
            <div class="float-card-amazon">
              <div class="float-card-top-row">
                <div class="store-id-pill">
                  <span class="store-id-icon">A</span>
                  <span>Amazon</span>
                </div>
                <span class="store-check-green">✓</span>
              </div>
              <div class="float-price-row">
                <span class="float-price-amount">₹59,999</span>
                <span class="float-discount-tag">-13%</span>
              </div>
              <div class="float-subtext">Lowest demo price</div>
            </div>

            <!-- Stylized iPhone 15 -->
            <div class="mockup-phone-frame">
              <div class="phone-gloss-highlight"></div>
              <div class="phone-dynamic-island">
                <span class="camera-dot"></span>
              </div>
              <div class="phone-screen-art">
                <div class="phone-screen-sphere"></div>
                <div class="phone-caption">IPHONE 15</div>
              </div>
            </div>

            <!-- Floating Card 2: Price Trend Card -->
            <div class="float-card-trend">
              <div class="trend-card-header">
                <span class="trend-card-title">Price trend</span>
                <span class="trend-percent-badge">↘ 8.2%</span>
              </div>
              <svg class="trend-chart-mini" viewBox="0 0 170 42" fill="none">
                <path d="M0 32C25 32 35 15 60 22C85 29 95 8 120 18C145 28 155 12 170 14" stroke="#7B2CBF" stroke-width="2.6" stroke-linecap="round"/>
                <path d="M0 32C25 32 35 15 60 22C85 29 95 8 120 18C145 28 155 12 170 14V42H0V32Z" fill="url(#miniTrendGrad)" opacity="0.3"/>
                <defs>
                  <linearGradient id="miniTrendGrad" x1="0" y1="0" x2="0" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#9D4EDD"/>
                    <stop offset="1" stop-color="#9D4EDD" stop-opacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="trend-axis-labels">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>

            <!-- Floating Pill: Know before you buy -->
            <div class="float-pill-know">
              <span class="check-circle-icon">✓</span>
              <span>Know before you buy</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Bottom Ticker / Strip -->
      <div class="hero-bottom-strip">
        <div class="strip-left">ONE PLACE TO MAKE A BETTER BUY</div>
        <div class="strip-center">
          <span>Compare</span>
          <span class="strip-bullet">•</span>
          <span>Track</span>
          <span class="strip-bullet">•</span>
          <span>Save</span>
        </div>
        <button class="strip-scroll-btn" onclick="document.getElementById('categoriesSection').scrollIntoView({behavior:'smooth'})" aria-label="Scroll to categories">
          ↓
        </button>
      </div>
    </div>
  </section>

  <!-- ============================================================
       CATEGORIES SECTION (PLACED DIRECTLY UNDER HOME HERO)
       ============================================================ -->
  <section class="section-wrapper" id="categoriesSection" style="padding-top: 50px; padding-bottom: 50px;">
    <div class="container">
      <div class="section-header">
        <div>
          <h2 class="section-title">Explore Categories</h2>
          <p class="section-subtitle">Find deals and compare prices across 7 major e-commerce categories</p>
        </div>
      </div>

      <div class="categories-grid" id="categoriesGrid">
${categoriesHtml}
      </div>
    </div>
  </section>

  <!-- ============================================================
       SEARCH RESULTS SECTION (MATCHES SCREENSHOT REFERENCE)
       ============================================================ -->
  <section class="section-wrapper" id="searchResultsSection" style="padding-top: 30px; display: block;">
    <div class="container">
${searchResultsHtml}
    </div>
  </section>

  <!-- ============================================================
       ACTIVE PRODUCT COMPARISON & STORE CARDS SECTION
       ============================================================ -->
  <section class="container" id="productComparisonSection" style="display: block;">
    <div class="comparison-section">
      <div class="comparison-header">
        <div class="product-image-container">
          <img class="product-main-img" id="detailProductImage" src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80" alt="Apple iPhone 15" onerror="handleImageError(this)" />
        </div>

        <div class="product-info-col">
          <div>
            <div class="product-meta-row">
              <span class="badge-pill badge-amethyst" id="detailCategoryBadge">Electronics</span>
              <span class="badge-pill badge-best-price">★ Lowest Demo Price</span>
            </div>
            <h2 class="product-detail-title" id="detailProductTitle">Apple iPhone 15</h2>
            <div class="product-rating-row" id="detailRatingText">
              <span class="star-rating">★ 4.7</span> · 4,320 ratings across verified stores
            </div>
            <p class="product-detail-desc" id="detailProductDesc">
              6.1-inch Super Retina XDR display, Dynamic Island, 48MP main camera with 2x Telephoto, USB-C connectivity, and all-day battery life.
            </p>
          </div>

          <div>
            <!-- Stat Banner -->
            <div class="price-stats-banner">
              <div class="stat-item">
                <span class="stat-label">Lowest Price</span>
                <span class="stat-value highlight-green" id="detailLowestPrice">₹58,999</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Average Price</span>
                <span class="stat-value" id="detailAvgPrice">₹60,249</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Potential Saving</span>
                <span class="stat-value highlight-green" id="detailPotentialSaving">₹1,500</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="product-actions-row">
              <button class="btn btn-primary" id="btnTrackProduct" onclick="handleTrackCurrentProduct()">
                📌 Track Product
              </button>
              <button class="btn btn-secondary" onclick="handleOpenAlertModal()">
                🔔 Set Price Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Store Comparison Cards Grid -->
      <div class="store-cards-title">
        <span>Available Store Prices</span>
        <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">
          Prices verified from demo catalog
        </span>
      </div>

      <div class="store-cards-grid" id="storeCardsGrid">
${storeCardsHtml}
      </div>

      <!-- ============================================================
           PRICE HISTORY & INSIGHTS
           ============================================================ -->
      <div class="history-section-grid" id="priceHistorySection">
        <div class="history-chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3>Price History Trend</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                Historical price fluctuations across verified stores
              </p>
            </div>
            <div class="timeframe-toggles">
              <button class="tf-btn active" data-tf="30d">30 Days</button>
              <button class="tf-btn" data-tf="90d">90 Days</button>
              <button class="tf-btn" data-tf="6m">6 Months</button>
              <button class="tf-btn" data-tf="1y">1 Year</button>
            </div>
          </div>

          <div class="chart-canvas-container">
            <canvas id="priceHistoryChart"></canvas>
          </div>
        </div>

        <!-- Insight Box -->
        <div class="insight-card">
          <div>
            <div class="insight-badge" id="insightBadge">GOOD DEAL</div>
            <h4 class="insight-title">Smart Price Insight</h4>
            <p class="insight-description" id="insightDesc">
              Great time to buy! The current lowest price is ₹1,500 below the 30-day average.
            </p>
          </div>

          <div>
            <div class="insight-savings-box">
              <div class="savings-label">YOU SAVE UP TO</div>
              <div class="savings-amount" id="insightSaveAmount">₹1,500</div>
            </div>
            <p style="font-size: 0.76rem; color: var(--mauve); opacity: 0.85;">
              Based on historical retail averages and available seller discounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ============================================================
       PRICE DISCLAIMER BANNER
       ============================================================ -->
  <div class="container">
    <div class="disclaimer-banner">
      <div class="disclaimer-icon">ℹ️</div>
      <div class="disclaimer-text">
        <h4>Academic Project Demonstration Disclaimer</h4>
        <p>
          PriceWise is a college project prototype built with Python Flask, SQLite, RapidFuzz, HTML5, CSS3, Vanilla JavaScript, and Chart.js.
          All displayed store prices, discounts, and seller comparisons are sample demonstration data. The application does not scrape live third-party e-commerce platforms and is designed with clean modular interfaces ready for official partner API integration in the future.
        </p>
      </div>
    </div>
  </div>

  <!-- ============================================================
       FOOTER
       ============================================================ -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand-logo" style="margin-bottom: 8px;">
            <div class="brand-icon-box" style="width:32px; height:32px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="7" width="18" height="14" rx="3"/>
                <path d="M16 7V5a4 4 0 0 0-8 0v2"/>
              </svg>
            </div>
            <span class="brand-text">
              <span style="color:#FFFFFF;">Price</span><span style="color:var(--mauve-magic);">Wise</span>
            </span>
          </div>
          <p>
            Smart price comparison & price tracking platform. Compare prices across top stores and never overpay again.
          </p>
        </div>

        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="javascript:void(0)" onclick="selectCategory(1)">Electronics</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory(2)">Beauty & Personal Care</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory(3)">Fragrance</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory(4)">Household</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory(5)">Grocery</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory(6)">Sports</a></li>
            <li><a href="javascript:void(0)" onclick="selectCategory(7)">Fashion</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Supported Stores</h4>
          <ul>
            <li><a href="javascript:void(0)">Amazon</a></li>
            <li><a href="javascript:void(0)">Flipkart</a></li>
            <li><a href="javascript:void(0)">Meesho</a></li>
            <li><a href="javascript:void(0)">Blinkit</a></li>
            <li><a href="javascript:void(0)">Zepto</a></li>
            <li><a href="javascript:void(0)">Myntra</a></li>
            <li><a href="javascript:void(0)">Nykaa</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Project Details</h4>
          <ul>
            <li><span style="font-size:0.85rem; color:#FFFFFF;">College Project</span></li>
            <li><span style="font-size:0.85rem; color:var(--mauve);">Python Flask + SQLite</span></li>
            <li><span style="font-size:0.85rem; color:var(--mauve);">RapidFuzz Typo Engine</span></li>
            <li><span style="font-size:0.85rem; color:var(--mauve);">Chart.js Analytics</span></li>
            <li><span style="font-size:0.85rem; color:var(--mauve);">Vanilla JavaScript</span></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© 2026 PriceWise. Academic Prototype. All rights reserved.</div>
        <div>Engineered for College Project Demonstration & Replit Deployment</div>
      </div>
    </div>
  </footer>

  <!-- ============================================================
       MODALS
       ============================================================ -->

  <!-- 1. Price Alert Modal -->
  <div class="modal-overlay" id="alertModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Set Price Alert</h3>
        <button class="modal-close-btn" onclick="handleCloseAlertModal()">✕</button>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px;">
        We will notify you when the price for <strong id="alertProductTitle" style="color:var(--mauve-magic);">Apple iPhone 15</strong> drops to or below your target price.
      </p>
      <form onsubmit="handleSubmitPriceAlert(event)">
        <div class="form-group">
          <label class="form-label">Target Price (₹)</label>
          <input type="number" id="alertTargetPriceInput" class="form-input" min="1" step="1" value="55000" required />
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="handleCloseAlertModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Activate Alert</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 2. Tracked Products Modal -->
  <div class="modal-overlay" id="trackedModal">
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h3 class="modal-title">Tracked Products</h3>
        <button class="modal-close-btn" onclick="handleCloseTrackedModal()">✕</button>
      </div>
      <div class="data-list" id="trackedItemsList">
        <!-- Rendered dynamically -->
      </div>
      <div style="margin-top: 24px; text-align: right;">
        <button class="btn btn-secondary" onclick="handleCloseTrackedModal()">Close</button>
      </div>
    </div>
  </div>

  <!-- 3. Active Alerts List Modal -->
  <div class="modal-overlay" id="alertsListModal">
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h3 class="modal-title">Active Price Alerts</h3>
        <button class="modal-close-btn" onclick="handleCloseAlertsListModal()">✕</button>
      </div>
      <div class="data-list" id="activeAlertsList">
        <!-- Rendered dynamically -->
      </div>
      <div style="margin-top: 24px; text-align: right;">
        <button class="btn btn-secondary" onclick="handleCloseAlertsListModal()">Close</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Application Script with In-Memory Client Fallback -->
  <script id="pricewise-app-script">
${clientJs}
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', fullHtml, 'utf8');
fs.writeFileSync('templates/index.html', fullHtml, 'utf8');
console.log('Successfully wrote index.html and templates/index.html with full pre-rendered HTML and embedded styles!');
