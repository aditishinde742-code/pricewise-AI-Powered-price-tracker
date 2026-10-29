/**
 * PriceWise – Smart Price Comparison & Price Tracking Platform
 * Client-Side Application Logic (HTML5, Vanilla JS, Chart.js)
 */

// Application State
const AppState = {
  currentProduct: null,
  currentTimeframe: '30d',
  chartInstance: null,
  trackedProducts: [],
  priceAlerts: [],
  categories: []
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('searchForm');
const searchResultsSection = document.getElementById('searchResultsSection');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCountText = document.getElementById('resultsCountText');
const productComparisonSection = document.getElementById('productComparisonSection');
const categoriesGrid = document.getElementById('categoriesGrid');
const storeCardsGrid = document.getElementById('storeCardsGrid');
const toastContainer = document.getElementById('toastContainer');

// Modals
const alertModal = document.getElementById('alertModal');
const trackedModal = document.getElementById('trackedModal');
const alertTargetPriceInput = document.getElementById('alertTargetPriceInput');
const alertProductTitle = document.getElementById('alertProductTitle');

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initCategories();
  initTrackedAndAlertsCount();
  setupEventListeners();

  // Initial featured search so the page starts with engaging content
  performSearch('iPhone');
});

// Setup Events
function setupEventListeners() {
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q) performSearch(q);
    });
  }

  // Nav links active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Quick suggestion pills
  document.querySelectorAll('.suggestion-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query || btn.textContent.trim();
      searchInput.value = query;
      performSearch(query);
    });
  });

  // Timeframe toggles for Price History Chart
  document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tf = btn.dataset.tf;
      AppState.currentTimeframe = tf;
      if (AppState.currentProduct) {
        loadPriceHistory(AppState.currentProduct.id, tf);
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
}

// Toast Notifications
function showToast(message, type = 'success') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ'}</span>
    <div>${message}</div>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Format Currency
function formatINR(val) {
  return '₹' + Number(val).toLocaleString('en-IN');
}

// Image Fallback Handler
function handleImageError(img) {
  img.onerror = null;
  img.src = '/static/images/placeholder-product.svg';
}

/* ============================================================
   CATEGORIES
   ============================================================ */
async function initCategories() {
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    AppState.categories = data.categories || [];
    renderCategories(AppState.categories);
  } catch (err) {
    console.error('Failed to load categories', err);
  }
}

function renderCategories(categories) {
  if (!categoriesGrid) return;
  categoriesGrid.innerHTML = '';

  const iconMap = {
    'electronics': '💻',
    'beauty-personal-care': '✨',
    'fragrance': '🌸',
    'household': '🏠',
    'grocery': '🛒',
    'sports': '🏏',
    'fashion': '👕'
  };

  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.id = cat.id;
    card.innerHTML = `
      <div class="category-icon-box">${iconMap[cat.slug] || '🏷️'}</div>
      <div class="category-name">${cat.name}</div>
      <div class="category-count">${cat.product_count} Products</div>
    `;
    card.addEventListener('click', () => selectCategory(cat.id, card));
    categoriesGrid.appendChild(card);
  });
}

async function selectCategory(catId, cardEl) {
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
  if (cardEl) cardEl.classList.add('active');

  try {
    const res = await fetch(`/api/categories/${catId}/products`);
    const data = await res.json();
    if (data.products) {
      renderSearchResults(data.products, `Category: ${data.category.name}`);
    }
  } catch (err) {
    showToast('Failed to load category products', 'error');
  }
}

/* ============================================================
   SEARCH FLOW
   ============================================================ */
async function performSearch(query) {
  if (!query) return;

  if (resultsCountText) {
    resultsCountText.innerHTML = `Searching for "<strong>${escapeHtml(query)}</strong>"...`;
  }
  searchResultsSection.style.display = 'block';

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      renderSearchResults(data.results, query, data.is_url, data.parsed_keywords);
      // Automatically load the top best match into the comparison section
      selectProduct(data.results[0].id, false);
    } else {
      renderEmptyState(query);
    }
  } catch (err) {
    console.error('Search error', err);
    showToast('Search encountered an error. Please try again.', 'error');
    renderEmptyState(query);
  }
}

function renderSearchResults(products, query, isUrl = false, parsedKw = '') {
  resultsGrid.innerHTML = '';
  searchResultsSection.style.display = 'block';

  const cleanQuery = query.replace('Category: ', '');
  let headerHtml = `
    <div style="display: flex; align-items: flex-start; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 12px;">
      <div>
        <div class="results-count-text">
          <span class="results-dot-pink"></span>
          <span>Search Results for "${escapeHtml(cleanQuery)}"</span>
        </div>
        <div class="results-subtext">Click on any item above to load store comparison rates, dynamic discounts, and price history.</div>
      </div>
      <div class="results-total-badge">Showing <strong>${products.length}</strong> items</div>
    </div>
  `;
  resultsCountText.innerHTML = headerHtml;

  const currentId = AppState.currentProduct ? AppState.currentProduct.product_id : (products[0] ? products[0].id : null);

  products.forEach(p => {
    const isSelected = (p.id === currentId);
    const savingsVal = Math.max(0, (p.highest_price || 0) - (p.lowest_price || 0)) || (Math.round(p.lowest_price * 0.12));
    const card = document.createElement('div');
    card.className = `product-card ${isSelected ? 'active-selected' : ''}`;
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="product-card-thumb-wrapper">
        <img class="product-card-thumb" src="${p.image}" alt="${escapeHtml(p.name)}" onerror="handleImageError(this)" loading="lazy" />
        <span class="product-card-save-badge">Save ${formatINR(savingsVal)}</span>
      </div>
      <div class="product-card-content">
        <div>
          <div class="product-card-cat-label">${(p.category || 'Product').toUpperCase()}</div>
          <h4 class="product-card-title">${p.name}</h4>
          <div class="product-card-rating">
            <span class="star-rating-pill">★ ${p.rating}</span>
            <span>(${Number(p.reviews).toLocaleString()})</span>
          </div>
        </div>
        <div class="product-card-bottom-row">
          <div class="price-col">
            <span class="price-col-from">FROM</span>
            <span class="product-card-price-val">${formatINR(p.lowest_price)}</span>
          </div>
          <button class="btn-card-action ${isSelected ? 'btn-card-viewing' : 'btn-card-compare'}">
            ${isSelected ? 'Viewing →' : 'Compare →'}
          </button>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      selectProduct(p.id, true);
    });
    resultsGrid.appendChild(card);
  });
}

function renderEmptyState(query) {
  resultsGrid.innerHTML = `
    <div class="empty-state-card" style="grid-column: 1 / -1;">
      <div class="empty-icon-circle">🔍</div>
      <h3 class="empty-title">No exact match found for "${escapeHtml(query)}"</h3>
      <p class="empty-desc">Check your spelling or try searching for popular items below:</p>
      <div class="empty-suggestions">
        <button class="suggestion-pill" onclick="handleEmptySearchClick('Clean & Clear Face Wash')">Face Wash</button>
        <button class="suggestion-pill" onclick="handleEmptySearchClick('Perfume')">Perfume</button>
        <button class="suggestion-pill" onclick="handleEmptySearchClick('Shampoo')">Shampoo</button>
        <button class="suggestion-pill" onclick="handleEmptySearchClick('Colgate')">Colgate</button>
        <button class="suggestion-pill" onclick="handleEmptySearchClick('Cricket Bat')">Cricket Bat</button>
        <button class="suggestion-pill" onclick="handleEmptySearchClick('iPhone 15')">iPhone 15</button>
        <button class="suggestion-pill" onclick="handleEmptySearchClick('Coffee')">Coffee</button>
      </div>
    </div>
  `;
}

window.handleEmptySearchClick = function(term) {
  searchInput.value = term;
  performSearch(term);
};

/* ============================================================
   PRODUCT DETAIL & MULTI-STORE PRICE COMPARISON
   ============================================================ */
async function selectProduct(productId, shouldScroll = false) {
  try {
    const res = await fetch(`/api/products/${productId}/prices`);
    const data = await res.json();
    if (!data || data.error) return;

    AppState.currentProduct = data;
    renderProductDetail(data);
    renderStoreCards(data.stores, data.lowest_price);
    loadPriceHistory(productId, AppState.currentTimeframe);

    // Update active-selected card styling in resultsGrid
    document.querySelectorAll('.product-card').forEach(c => {
      const isMatch = Number(c.dataset.id) === Number(productId);
      c.classList.toggle('active-selected', isMatch);
      const btn = c.querySelector('.btn-card-action');
      if (btn) {
        btn.className = `btn-card-action ${isMatch ? 'btn-card-viewing' : 'btn-card-compare'}`;
        btn.textContent = isMatch ? 'Viewing →' : 'Compare →';
      }
    });

    productComparisonSection.style.display = 'block';

    if (shouldScroll) {
      productComparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (err) {
    console.error('Failed to load product comparison', err);
    showToast('Failed to load store prices', 'error');
  }
}

function renderProductDetail(data) {
  const imgEl = document.getElementById('detailProductImage');
  const catEl = document.getElementById('detailCategoryBadge');
  const titleEl = document.getElementById('detailProductTitle');
  const descEl = document.getElementById('detailProductDesc');
  const ratingEl = document.getElementById('detailRatingText');
  const lowestPriceEl = document.getElementById('detailLowestPrice');
  const avgPriceEl = document.getElementById('detailAvgPrice');
  const savingEl = document.getElementById('detailPotentialSaving');
  const trackBtn = document.getElementById('btnTrackProduct');

  if (imgEl) {
    imgEl.src = data.image;
    imgEl.alt = data.product;
    imgEl.onerror = () => handleImageError(imgEl);
  }
  if (catEl) catEl.textContent = data.category;
  if (titleEl) titleEl.textContent = data.product;
  if (descEl) descEl.textContent = data.description;
  if (ratingEl) {
    ratingEl.innerHTML = `<span class="star-rating">★ ${data.rating}</span> · ${Number(data.reviews).toLocaleString()} verified ratings`;
  }
  if (lowestPriceEl) lowestPriceEl.textContent = formatINR(data.lowest_price);
  if (avgPriceEl) avgPriceEl.textContent = formatINR(data.average_price);
  if (savingEl) {
    savingEl.textContent = data.potential_saving > 0 ? `Save ${formatINR(data.potential_saving)}` : 'Best Value';
  }

  // Update track button state
  const isTracked = AppState.trackedProducts.some(t => t.id === data.product_id);
  if (trackBtn) {
    trackBtn.innerHTML = isTracked ? '✓ Tracking' : '📌 Track Product';
    trackBtn.className = isTracked ? 'btn btn-secondary' : 'btn btn-primary';
  }
}

function renderStoreCards(stores, lowestPrice) {
  if (!storeCardsGrid) return;
  storeCardsGrid.innerHTML = '';

  stores.forEach(st => {
    const isBest = (st.price === lowestPrice);
    const card = document.createElement('div');
    card.className = `store-card ${isBest ? 'best-price-card' : ''}`;

    card.innerHTML = `
      ${isBest ? '<div class="store-card-badge"><span class="badge-pill badge-best-price">★ BEST PRICE</span></div>' : ''}
      <div>
        <div class="store-card-top">
          <div class="store-logo-wrapper">
            <img src="${st.logo}" alt="${st.store}" class="store-logo-img" />
          </div>
          <span class="store-rating-badge">★ ${st.store_rating || 4.5}</span>
        </div>

        <div class="store-price-block">
          <div class="store-current-price">${formatINR(st.price)}</div>
          <div class="store-orig-price-row">
            <span class="store-orig-price">${formatINR(st.original_price)}</span>
            <span class="store-discount-badge">${st.discount}% OFF</span>
          </div>
        </div>

        <div class="store-logistics">
          <div class="stock-indicator ${st.availability.includes('Only') ? 'low-stock' : ''}">
            <span class="stock-dot"></span>
            <span>${st.availability}</span>
          </div>
          <div class="delivery-text">⚡ ${st.delivery}</div>
        </div>
      </div>

      <a href="${st.product_url}" target="_blank" rel="noopener noreferrer" class="btn btn-deal ${isBest ? 'btn-primary' : 'btn-secondary'}">
        View Deal on ${st.store} →
      </a>
    `;
    storeCardsGrid.appendChild(card);
  });
}

/* ============================================================
   PRICE HISTORY & CHART.JS
   ============================================================ */
async function loadPriceHistory(productId, timeframe = '30d') {
  try {
    const res = await fetch(`/api/products/${productId}/history?timeframe=${timeframe}`);
    const data = await res.json();
    if (!data || data.error) return;

    renderPriceHistoryChart(data.history, data.product);
    renderPriceInsights(data);
  } catch (err) {
    console.error('Failed to load price history', err);
  }
}

function renderPriceHistoryChart(historyData, productName) {
  const canvas = document.getElementById('priceHistoryChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (AppState.chartInstance) {
    AppState.chartInstance.destroy();
  }

  if (!historyData || historyData.length === 0) return;

  const labels = historyData.map(h => {
    const d = new Date(h.recorded_at);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const dataPoints = historyData.map(h => h.price);

  // Gradient fill for line
  const gradient = ctx.createLinearGradient(0, 0, 0, 260);
  gradient.addColorStop(0, 'rgba(123, 44, 191, 0.35)');
  gradient.addColorStop(1, 'rgba(157, 78, 221, 0.01)');

  AppState.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Price (₹)',
        data: dataPoints,
        borderColor: '#7B2CBF',
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#5A189A',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#10002B',
          titleColor: '#E0AAFF',
          bodyColor: '#FFFFFF',
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(ctx) {
              const item = historyData[ctx.dataIndex];
              return `Price: ₹${ctx.raw.toLocaleString('en-IN')} (${item.store})`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#847C93', font: { size: 11 } }
        },
        y: {
          grid: { color: '#F0EAF8' },
          ticks: {
            color: '#847C93',
            callback: value => '₹' + Number(value).toLocaleString('en-IN')
          }
        }
      }
    }
  });
}

function renderPriceInsights(data) {
  const badgeEl = document.getElementById('insightBadge');
  const descEl = document.getElementById('insightDesc');
  const saveAmountEl = document.getElementById('insightSaveAmount');

  if (badgeEl) badgeEl.textContent = (data.badge || 'GOOD DEAL').toUpperCase();
  if (descEl) descEl.textContent = data.insight;
  if (saveAmountEl) {
    const diff = Math.max(0, data.average - data.current_lowest);
    saveAmountEl.textContent = formatINR(diff);
  }
}

/* ============================================================
   PRODUCT TRACKING & PRICE ALERTS
   ============================================================ */
async function initTrackedAndAlertsCount() {
  try {
    const [tRes, aRes] = await Promise.all([
      fetch('/api/tracked'),
      fetch('/api/alerts')
    ]);
    const tData = await tRes.json();
    const aData = await aRes.json();

    AppState.trackedProducts = tData.tracked_products || [];
    AppState.priceAlerts = aData.alerts || [];

    updateNavBadges();
  } catch (err) {
    console.error('Error fetching initial tracked items', err);
  }
}

function updateNavBadges() {
  const trackedBadge = document.getElementById('trackedNavBadge');
  const alertsBadge = document.getElementById('alertsNavBadge');

  if (trackedBadge) trackedBadge.textContent = AppState.trackedProducts.length;
  if (alertsBadge) alertsBadge.textContent = AppState.priceAlerts.length;
}

// Toggle Tracking for Current Product
window.handleTrackCurrentProduct = async function() {
  if (!AppState.currentProduct) return;
  const prodId = AppState.currentProduct.product_id;
  const isAlreadyTracked = AppState.trackedProducts.some(t => t.id === prodId);

  try {
    if (isAlreadyTracked) {
      await fetch(`/api/track/${prodId}`, { method: 'DELETE' });
      AppState.trackedProducts = AppState.trackedProducts.filter(t => t.id !== prodId);
      showToast('Product removed from tracked list');
    } else {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: prodId })
      });
      AppState.trackedProducts.push(AppState.currentProduct);
      showToast('Product is now tracked! You will be alerted on price drops.');
    }
    updateNavBadges();
    renderProductDetail(AppState.currentProduct);
  } catch (err) {
    showToast('Failed to update tracking state', 'error');
  }
};

// Open Set Price Alert Modal
window.handleOpenAlertModal = function() {
  if (!AppState.currentProduct) return;
  alertProductTitle.textContent = AppState.currentProduct.product;
  // Suggest 5% below lowest price
  const suggested = Math.round(AppState.currentProduct.lowest_price * 0.95);
  alertTargetPriceInput.value = suggested;
  alertModal.classList.add('active');
};

window.handleCloseAlertModal = function() {
  alertModal.classList.remove('active');
};

window.handleSubmitPriceAlert = async function(e) {
  e.preventDefault();
  if (!AppState.currentProduct) return;
  const targetPrice = parseFloat(alertTargetPriceInput.value);

  if (!targetPrice || targetPrice <= 0) {
    showToast('Please enter a valid target price', 'error');
    return;
  }

  try {
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: AppState.currentProduct.product_id,
        target_price: targetPrice
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Price alert activated for ${formatINR(targetPrice)}!`);
      handleCloseAlertModal();
      initTrackedAndAlertsCount();
    }
  } catch (err) {
    showToast('Failed to save price alert', 'error');
  }
};

// Open Tracked Products Modal
window.handleOpenTrackedModal = async function() {
  try {
    const res = await fetch('/api/tracked');
    const data = await res.json();
    AppState.trackedProducts = data.tracked_products || [];
    renderTrackedList(AppState.trackedProducts);
    trackedModal.classList.add('active');
  } catch (err) {
    showToast('Failed to load tracked products', 'error');
  }
};

window.handleCloseTrackedModal = function() {
  trackedModal.classList.remove('active');
};

function renderTrackedList(items) {
  const container = document.getElementById('trackedItemsList');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted);">No tracked products yet. Search and click "Track Product" to start monitoring!</div>';
    return;
  }

  container.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'data-item';
    el.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.name)}" class="data-item-img" onerror="handleImageError(this)" />
      <div class="data-item-info">
        <div class="data-item-title">${item.name}</div>
        <div class="data-item-price">Lowest: ${formatINR(item.lowest_price)}</div>
      </div>
      <button class="btn btn-sm btn-secondary" onclick="selectProduct(${item.id}, true); handleCloseTrackedModal();">View</button>
      <button class="data-item-remove-btn" title="Untrack" onclick="handleRemoveTracked(${item.id})">✕</button>
    `;
    container.appendChild(el);
  });
}

window.handleRemoveTracked = async function(productId) {
  try {
    await fetch(`/api/track/${productId}`, { method: 'DELETE' });
    AppState.trackedProducts = AppState.trackedProducts.filter(t => t.id !== productId);
    renderTrackedList(AppState.trackedProducts);
    updateNavBadges();
    showToast('Item untracked');
  } catch (err) {
    showToast('Failed to untrack item', 'error');
  }
};

// Open Price Alerts Modal
window.handleOpenAlertsListModal = async function() {
  try {
    const res = await fetch('/api/alerts');
    const data = await res.json();
    AppState.priceAlerts = data.alerts || [];
    renderAlertsList(AppState.priceAlerts);
    document.getElementById('alertsListModal').classList.add('active');
  } catch (err) {
    showToast('Failed to load price alerts', 'error');
  }
};

window.handleCloseAlertsListModal = function() {
  document.getElementById('alertsListModal').classList.remove('active');
};

function renderAlertsList(alerts) {
  const container = document.getElementById('activeAlertsList');
  if (!container) return;

  if (alerts.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted);">No active price alerts. Click "Set Price Alert" on any product to be notified!</div>';
    return;
  }

  container.innerHTML = '';
  alerts.forEach(a => {
    const el = document.createElement('div');
    el.className = 'data-item';
    const isReached = a.lowest_price <= a.target_price;
    el.innerHTML = `
      <img src="${a.image}" alt="${escapeHtml(a.name)}" class="data-item-img" onerror="handleImageError(this)" />
      <div class="data-item-info">
        <div class="data-item-title">${a.name}</div>
        <div style="font-size:0.8rem; color:${isReached ? 'var(--success-green)' : 'var(--royal-violet)'}; font-weight:700;">
          Target: ${formatINR(a.target_price)} · Current: ${formatINR(a.lowest_price)} ${isReached ? '(Target Reached!)' : ''}
        </div>
      </div>
      <button class="btn btn-sm btn-secondary" onclick="selectProduct(${a.product_id}, true); handleCloseAlertsListModal();">View</button>
      <button class="data-item-remove-btn" title="Delete alert" onclick="handleDeleteAlert(${a.alert_id})">✕</button>
    `;
    container.appendChild(el);
  });
}

window.handleDeleteAlert = async function(alertId) {
  try {
    await fetch(`/api/alerts/${alertId}`, { method: 'DELETE' });
    AppState.priceAlerts = AppState.priceAlerts.filter(a => a.alert_id !== alertId);
    renderAlertsList(AppState.priceAlerts);
    updateNavBadges();
    showToast('Alert deleted');
  } catch (err) {
    showToast('Failed to delete alert', 'error');
  }
};

// Utility Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
