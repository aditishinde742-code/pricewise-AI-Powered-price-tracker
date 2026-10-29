/**
 * PriceWise – Smart Price Comparison & Price Tracking Platform
 * Client-Side Application Logic (HTML5, Vanilla JS, Chart.js)
 * Fully Self-Contained with Zero-Dependency Catalog Fallback
 */

const EMBEDDED_CATALOG = {"products":[{"id":1,"name":"Apple iPhone 15","category_id":1,"category":"Electronics","description":"Apple iPhone 15 (128 GB) featuring Dynamic Island, 48MP main camera, USB-C, and all-day battery life powered by A16 Bionic chip.","keywords":"apple iphone 15 iphon phone smartphone ios mobile 128gb dynamic island electronics a16","rating":4.8,"reviews":14200,"image":"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80","lowest_price":58999,"highest_price":62999,"average_price":60832,"potential_saving":4000,"stores_count":3},{"id":2,"name":"Samsung Galaxy S24 Ultra","category_id":1,"category":"Electronics","description":"Flagship Samsung Galaxy S24 Ultra 5G with AI Photo Assist, Snapdragon 8 Gen 3, Titanium Frame, and embedded S-Pen.","keywords":"samsung galaxy phone s24 ultra android smartphone mobile camera 5g galaxy phone electronics","rating":4.7,"reviews":8940,"image":"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80","lowest_price":118499,"highest_price":122999,"average_price":120499,"potential_saving":4500,"stores_count":3},{"id":3,"name":"OnePlus 12 5G","category_id":1,"category":"Electronics","description":"OnePlus 12 with 4th Gen Hasselblad Camera, Snapdragon 8 Gen 3, 100W SUPERVOOC charging, and 2K ProXDR Display.","keywords":"oneplus phone 12 one plus smartphone android mobile 5g oxygenos fast charging electronics","rating":4.6,"reviews":6120,"image":"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80","lowest_price":63999,"highest_price":64999,"average_price":64499,"potential_saving":1000,"stores_count":2},{"id":4,"name":"Apple MacBook Air M3","category_id":1,"category":"Electronics","description":"13.6-inch Liquid Retina Display, 8GB Unified Memory, 256GB SSD, backlit Magic Keyboard, 18-hour battery.","keywords":"macbook air apple mac laptop notebook m2 m3 computer macos macbook air pro electronics","rating":4.9,"reviews":5800,"image":"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80","lowest_price":98990,"highest_price":99990,"average_price":99490,"potential_saving":1000,"stores_count":2},{"id":5,"name":"HP Laptop 15s","category_id":1,"category":"Electronics","description":"HP 15s Intel Core i5 12th Gen, 16GB DDR4 RAM, 512GB NVMe SSD, 15.6-inch FHD Micro-Edge Anti-Glare Display.","keywords":"hp laptop 15s notebook intel core i5 computer windows pc electronics","rating":4.4,"reviews":4310,"image":"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80","lowest_price":50999,"highest_price":52990,"average_price":51826,"potential_saving":1991,"stores_count":3},{"id":6,"name":"Dell Laptop XPS 13","category_id":1,"category":"Electronics","description":"Dell XPS 13 Ultrabook with Intel Core Ultra 7, InfinityEdge Touch Display, CNC Aluminum chassis and Wi-Fi 7.","keywords":"dell laptop xps 13 notebook ultrabook portable computer pc electronics","rating":4.6,"reviews":3210,"image":"https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80","lowest_price":132990,"highest_price":134990,"average_price":133990,"potential_saving":2000,"stores_count":2},{"id":7,"name":"Sony WH-1000XM5","category_id":1,"category":"Electronics","description":"Industry Leading Wireless Noise Cancelling Headphones with Auto NC Optimizer, 30hr battery, crystal clear hands-free calling.","keywords":"sony wh-1000xm5 headphones headphnes audio wireless bluetooth over ear anc headset electronics","rating":4.8,"reviews":9150,"image":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80","lowest_price":25990,"highest_price":27990,"average_price":26823,"potential_saving":2000,"stores_count":3},{"id":8,"name":"boAt Rockerz 550 Wireless","category_id":1,"category":"Electronics","description":"boAt Rockerz 550 Over-Ear Wireless Headphones with 50mm dynamic drivers, 20 hours playback, and plush ear cushions.","keywords":"boat headphones boat rockerz wireless bluetooth audio headset bass sound electronics","rating":4.3,"reviews":18500,"image":"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80","lowest_price":1549,"highest_price":1899,"average_price":1737,"potential_saving":350,"stores_count":4},{"id":9,"name":"Apple Watch Series 9","category_id":1,"category":"Electronics","description":"Apple Watch with S9 SiP, Double Tap gesture control, brighter Always-On Retina display, ECG and blood oxygen monitoring.","keywords":"apple smartwatch watch series 9 fitness tracker wearable health monitor electronics","rating":4.7,"reviews":7200,"image":"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80","lowest_price":37999,"highest_price":39999,"average_price":38832,"potential_saving":2000,"stores_count":3},{"id":10,"name":"Apple iPad Air 11-inch","category_id":1,"category":"Electronics","description":"iPad Air with M2 chip, Liquid Retina display, Touch ID, Landscape front camera, Wi-Fi 6E, and Apple Pencil Pro support.","keywords":"apple ipad tablet ios air m2 touch screen slate portable computer electronics","rating":4.8,"reviews":5420,"image":"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80","lowest_price":56990,"highest_price":57490,"average_price":57240,"potential_saving":500,"stores_count":2},{"id":11,"name":"Samsung 55-inch Crystal 4K TV","category_id":1,"category":"Electronics","description":"Samsung 138 cm (55 inches) Crystal 4K Vivid Pro Ultra HD Smart LED TV with PurColor, OTS Lite, and Motion Xcelerator.","keywords":"samsung tv television smart tv 4k uhd 55 inch display home theater screen electronics","rating":4.5,"reviews":6800,"image":"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80","lowest_price":40990,"highest_price":41990,"average_price":41490,"potential_saving":1000,"stores_count":2},{"id":12,"name":"Colgate MaxFresh Peppermint","category_id":2,"category":"Beauty & Personal Care","description":"Colgate MaxFresh Toothpaste with cooling crystals for intense freshness, cavity protection, and icy peppermint burst.","keywords":"colgate colgat maxfresh toothpaste tooth paste dental peppermint oral care hygiene brush","rating":4.6,"reviews":24500,"image":"https://images.unsplash.com/photo-1559591937-e62fb330bc1f?w=600&auto=format&fit=crop&q=80","lowest_price":105,"highest_price":115,"average_price":110,"potential_saving":10,"stores_count":5},{"id":13,"name":"Colgate Strong Teeth","category_id":2,"category":"Beauty & Personal Care","description":"Colgate Strong Teeth Anticavity Toothpaste with Amino Power for 2x stronger teeth and long-lasting calcium boost.","keywords":"colgate colgat strong teeth toothpaste dental cream oral hygiene tooth paste teeth","rating":4.5,"reviews":31000,"image":"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80","lowest_price":129,"highest_price":138,"average_price":134,"potential_saving":9,"stores_count":4},{"id":14,"name":"Clean & Clear Face Wash","category_id":2,"category":"Beauty & Personal Care","description":"Clean & Clear Foaming Face Wash specially formulated for oily skin with oil-free salicylic formula that won't clog pores.","keywords":"clean & clear clean clear clenis face wash facewash foaming skin beauty cleanser acne oil control skincare","rating":4.5,"reviews":18200,"image":"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80","lowest_price":199,"highest_price":220,"average_price":210,"potential_saving":21,"stores_count":5},{"id":15,"name":"Nivea Face Wash Dark Spot","category_id":2,"category":"Beauty & Personal Care","description":"Nivea Men Dark Spot Reduction 10x Face Wash with Whitanat Vita Complex Plus for clean and revitalized masculine skin.","keywords":"nivea face wash facewash men dark spot reduction skin cleanser grooming beauty","rating":4.4,"reviews":14300,"image":"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80","lowest_price":165,"highest_price":180,"average_price":172,"potential_saving":15,"stores_count":5},{"id":16,"name":"Himalaya Neem Face Wash","category_id":2,"category":"Beauty & Personal Care","description":"Himalaya Purifying Neem Face Wash enriched with Neem and Turmeric to prevent pimples and purify skin naturally.","keywords":"himalaya face wash facewash neem herbal natural ayurvedic skin acne cleanser beauty","rating":4.6,"reviews":42000,"image":"https://images.unsplash.com/photo-1556228852-6d35a585d566?w=600&auto=format&fit=crop&q=80","lowest_price":240,"highest_price":265,"average_price":253,"potential_saving":25,"stores_count":5},{"id":17,"name":"L'Oreal Total Repair Shampoo","category_id":2,"category":"Beauty & Personal Care","description":"L'Oreal Paris Total Repair 5 Shampoo formulated with Ceramide-Cement to fight the 5 signs of damaged hair.","keywords":"loreal l'oreal shampoo shampu total repair hair wash hair care conditioner beauty","rating":4.5,"reviews":19800,"image":"https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80","lowest_price":399,"highest_price":449,"average_price":424,"potential_saving":50,"stores_count":4},{"id":18,"name":"Dove Daily Moisture Shampoo","category_id":2,"category":"Beauty & Personal Care","description":"Dove Daily Moisture Shampoo with Bio-Nourish Complex leaves hair silky smooth, deeply moisturized, and manageable.","keywords":"dove shampoo shampu daily moisture hair wash moisturizing soft hair care beauty","rating":4.6,"reviews":28300,"image":"https://images.unsplash.com/photo-1608248597359-5613531b4632?w=600&auto=format&fit=crop&q=80","lowest_price":375,"highest_price":390,"average_price":382,"potential_saving":15,"stores_count":5},{"id":24,"name":"Fogg Scent Xtremo EDP","category_id":3,"category":"Fragrance","description":"Fogg Scent Xtremo Eau De Parfum 100ml for Men with long-lasting woody aromatic fragrance notes.","keywords":"fogg perfume perfumee fragrance scent xtremo edp deodorant men spray body spray","rating":4.3,"reviews":19200,"image":"https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80","lowest_price":399,"highest_price":479,"average_price":445,"potential_saving":80,"stores_count":5},{"id":25,"name":"Engage W1 Perfume Spray","category_id":3,"category":"Fragrance","description":"Engage W1 Perfume Spray for Women offering an exotic blend of citrus and floral notes with zero gas.","keywords":"engage perfume perfumee spray women floral citrus deodorant fragrance","rating":4.2,"reviews":11400,"image":"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80","lowest_price":219,"highest_price":245,"average_price":235,"potential_saving":26,"stores_count":4},{"id":28,"name":"Bella Vita Luxury Perfume Set","category_id":3,"category":"Fragrance","description":"Bella Vita Organic Luxury Man Perfume Gift Set with 4 x 20ml miniature bottles (Klub, OUD, White, Fresh).","keywords":"bella vita perfume perfumee luxury set fragrance edp gift box men cologne","rating":4.5,"reviews":23100,"image":"https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=600&auto=format&fit=crop&q=80","lowest_price":499,"highest_price":549,"average_price":529,"potential_saving":50,"stores_count":4},{"id":34,"name":"Surf Excel Matic Liquid Detergent","category_id":4,"category":"Household","description":"Surf Excel Matic Front Load Liquid Detergent 2L with 100% stain removal in 1 wash inside top/front load machines.","keywords":"surf excel matic detergent liquid laundry soap washing powder clothes cleaning household","rating":4.7,"reviews":34200,"image":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80","lowest_price":385,"highest_price":415,"average_price":400,"potential_saving":30,"stores_count":4},{"id":44,"name":"Bru Instant Coffee 200g","category_id":5,"category":"Grocery","description":"Bru Instant Coffee Granules 200g jar blend of 70% coffee and 30% chicory for rich aroma and authentic South Indian taste.","keywords":"bru coffee instant coffee chicory mix hot drink beverage caffeine morning grocery","rating":4.6,"reviews":27400,"image":"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80","lowest_price":365,"highest_price":390,"average_price":377,"potential_saving":25,"stores_count":4},{"id":45,"name":"Nescafe Classic Coffee 200g","category_id":5,"category":"Grocery","description":"Nescafe Classic 100% Pure Instant Coffee 200g glass jar with double filter technology for distinctive rich aroma.","keywords":"nescafe coffee instant coffee classic caffeine espresso beverage grocery","rating":4.7,"reviews":39800,"image":"https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80","lowest_price":549,"highest_price":580,"average_price":565,"potential_saving":31,"stores_count":4},{"id":51,"name":"SS Master English Willow Cricket Bat","category_id":6,"category":"Sports","description":"SS Master 5000 Handcrafted English Willow Cricket Bat with massive edges, light pickup, and contoured sweet spot.","keywords":"cricket bat criket bat english willow sports kashmir willow wood ball match equipment ss master","rating":4.7,"reviews":4800,"image":"https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=600&auto=format&fit=crop&q=80","lowest_price":899,"highest_price":1399,"average_price":1212,"potential_saving":500,"stores_count":4},{"id":52,"name":"Kookaburra Leather Cricket Ball","category_id":6,"category":"Sports","description":"Kookaburra Turf Regulation 4-piece White Leather Cricket Ball with hand-stitched seam for genuine swing and seam.","keywords":"cricket ball criket ball white leather ball sports seam match play tournament equipment","rating":4.6,"reviews":3200,"image":"https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80","lowest_price":549,"highest_price":649,"average_price":609,"potential_saving":100,"stores_count":3},{"id":55,"name":"Nike Pitch Football Size 5","category_id":6,"category":"Sports","description":"Nike Premier League Pitch Football with 12-panel design, rubber bladder, and high-contrast graphics for easy tracking.","keywords":"football ball soccer ball nike pitch sports premier league game team","rating":4.7,"reviews":5900,"image":"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80","lowest_price":1399,"highest_price":1495,"average_price":1438,"potential_saving":96,"stores_count":3},{"id":60,"name":"Levi's Classic Crewneck T-Shirt","category_id":7,"category":"Fashion","description":"Levi's Men's 100% Pure Combed Cotton Regular Fit Solid Crewneck T-Shirt with subtle batwing chest logo.","keywords":"t-shirt tshirt tee shirt cotton levis clothing casual wear men fashion","rating":4.4,"reviews":8200,"image":"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80","lowest_price":699,"highest_price":899,"average_price":812,"potential_saving":200,"stores_count":4},{"id":62,"name":"Nike Air Zoom Pegasus 40 Shoes","category_id":7,"category":"Fashion","description":"Nike Air Zoom Pegasus 40 Road Running Shoes with dual Zoom Air units and engineered mesh for responsive spring.","keywords":"running shoes sneakers nike pegasus athletic shoes footwear sports shoes fashion","rating":4.7,"reviews":7800,"image":"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80","lowest_price":6999,"highest_price":7495,"average_price":7298,"potential_saving":496,"stores_count":3}],"categories":[{"id":1,"name":"Electronics","slug":"electronics","icon":"laptop","description":"Smartphones, Laptops, Audio & Gadgets","product_count":11},{"id":2,"name":"Beauty & Personal Care","slug":"beauty-personal-care","icon":"sparkles","description":"Skincare, Haircare, Oral Care & Cosmetics","product_count":12},{"id":3,"name":"Fragrance","slug":"fragrance","icon":"spray-can","description":"Perfumes, Deodorants, Body Mists & Colognes","product_count":10},{"id":4,"name":"Household","slug":"household","icon":"home","description":"Cleaners, Detergents, Paper & Home Care","product_count":8},{"id":5,"name":"Grocery","slug":"grocery","icon":"shopping-cart","description":"Daily Essentials, Staples, Coffee, Tea & Snacks","product_count":9},{"id":6,"name":"Sports","slug":"sports","icon":"trophy","description":"Cricket, Football, Badminton, Shoes & Gear","product_count":9},{"id":7,"name":"Fashion","slug":"fashion","icon":"shirt","description":"Clothing, Footwear, Bags & Accessories","product_count":6}],"stores":[{"id":1,"name":"Amazon","logo":"/static/images/stores/amazon.svg","website":"https://www.amazon.in","rating":4.8},{"id":2,"name":"Flipkart","logo":"/static/images/stores/flipkart.svg","website":"https://flipkart.com","rating":4.6},{"id":3,"name":"Meesho","logo":"/static/images/stores/meesho.svg","website":"https://meesho.com","rating":4.3},{"id":4,"name":"Blinkit","logo":"/static/images/stores/blinkit.svg","website":"https://blinkit.com","rating":4.7},{"id":5,"name":"Zepto","logo":"/static/images/stores/zepto.svg","website":"https://zeptonow.com","rating":4.7},{"id":6,"name":"Myntra","logo":"/static/images/stores/myntra.svg","website":"https://myntra.com","rating":4.6},{"id":7,"name":"Nykaa","logo":"/static/images/stores/nykaa.svg","website":"https://nykaa.com","rating":4.8}]};

// Application State
const AppState = {
  currentProduct: { id: 1, name: "Apple iPhone 15", lowest_price: 58999 },
  currentTimeframe: '30d',
  chartInstance: null,
  trackedProducts: JSON.parse(localStorage.getItem('pricewise_tracked') || '[1, 2]'),
  priceAlerts: JSON.parse(localStorage.getItem('pricewise_alerts') || '[{"id":1,"product_id":1,"target_price":55000,"status":"Active"}]'),
  categories: EMBEDDED_CATALOG.categories
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
const alertsListModal = document.getElementById('alertsListModal');
const alertTargetPriceInput = document.getElementById('alertTargetPriceInput');
const alertProductTitle = document.getElementById('alertProductTitle');

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateBadgeCounts();
  
  // Render initial price history chart for iPhone 15
  loadPriceHistory(1, '30d');
  
  // Try refreshing categories from API in background (non-blocking)
  initCategories();
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
  document.querySelectorAll('.nav-link-btn').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link-btn').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
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

// Authentic Brand Vector Logos (Embedded inline for 100% resilient rendering in any deployment)
const STORE_LOGOS_SVG = {
  amazon: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><path d="M22 24.5C18.2 24.5 15.2 23.2 15.2 20.3C15.2 17.5 17.7 16.3 21.8 16.3C23.6 16.3 24.8 16.6 25.5 16.9V16.3C25.5 14.8 24.3 13.9 22.3 13.9C20.6 13.9 18.9 14.4 17.6 15.2L16.4 13.2C18 12.1 20.4 11.5 22.8 11.5C26.5 11.5 28.5 13.3 28.5 16.6V24.2H25.6V22.6C24.7 23.8 23.3 24.5 22 24.5ZM22.3 22.3C23.7 22.3 24.8 21.4 25.5 20.2V18.7C24.8 18.3 23.8 18.1 22.6 18.1C20.2 18.1 18.5 18.9 18.5 20.3C18.5 21.5 19.6 22.3 22.3 22.3Z" fill="#131921"/><text x="32" y="23" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#131921" letter-spacing="-0.5">amazon</text><path d="M18 29.5C28 35.5 58 35.5 78 28.5" stroke="#FF9900" stroke-width="2.6" stroke-linecap="round"/><path d="M74 26.5L78.5 28.8L76 33" stroke="#FF9900" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  flipkart: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><rect x="6" y="8" width="24" height="24" rx="4" fill="#2874F0"/><path d="M15 14H23V17.5H18.5V19.5H22.5V23H18.5V28H15V14Z" fill="#FFE500"/><text x="36" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="15" fill="#2874F0" letter-spacing="-0.3">Flipkart</text></svg>`,
  blinkit: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><rect width="112" height="34" rx="6" fill="#F8CB46" y="3" x="4"/><rect x="10" y="8" width="24" height="24" rx="5" fill="#0C831F"/><text x="16" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="17" fill="#FFFFFF">b</text><text x="40" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="#0C831F" letter-spacing="-0.3">blinkit</text></svg>`,
  meesho: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><rect x="6" y="8" width="24" height="24" rx="6" fill="#F43397"/><path d="M12 25V15L16 21L20 15V25" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="36" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="15" fill="#5A189A" letter-spacing="-0.3">meesho</text></svg>`,
  zepto: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><rect width="112" height="34" rx="6" fill="#3D005E" y="3" x="4"/><circle cx="22" cy="20" r="10" fill="#FF3269"/><text x="18" y="24.5" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="13" fill="#FFFFFF">z</text><text x="38" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="-0.3">zepto</text></svg>`,
  myntra: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><g transform="translate(6, 10)"><path d="M4 18L10 6L14 13L18 6L24 18" stroke="#FF3F6C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 18L10 12L13 18" stroke="#F16521" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g><text x="38" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="15" fill="#282C3F" letter-spacing="-0.3">Myntra</text></svg>`,
  nykaa: `<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-logo-svg"><text x="12" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="19" fill="#FC2779" letter-spacing="1">NYKAA</text></svg>`
};

function getStoreLogoHtml(storeName, logoUrl) {
  const norm = String(storeName || '').toLowerCase().trim();
  for (const [key, svg] of Object.entries(STORE_LOGOS_SVG)) {
    if (norm.includes(key)) {
      return svg;
    }
  }
  if (logoUrl) {
    return `<img class="store-logo-img" src="${logoUrl}" alt="${escapeHtml(storeName)}" onerror="handleStoreLogoError(this, '${escapeHtml(storeName)}')" />`;
  }
  return `<span style="font-weight:800;color:#131921;font-size:0.92rem;">${escapeHtml(storeName)}</span>`;
}

window.handleStoreLogoError = function(img, storeName) {
  if (!img) return;
  img.onerror = null;
  const parent = img.parentElement;
  if (parent) {
    const norm = String(storeName || img.alt || '').toLowerCase().trim();
    for (const [key, svg] of Object.entries(STORE_LOGOS_SVG)) {
      if (norm.includes(key)) {
        parent.innerHTML = svg;
        return;
      }
    }
    parent.innerHTML = `<span style="font-weight:800;color:#131921;font-size:0.92rem;">${escapeHtml(storeName || 'Store')}</span>`;
  }
};

// Image Fallback Handler
function handleImageError(img) {
  if (!img) return;
  img.onerror = null;
  if (img.classList && img.classList.contains('store-logo-img')) {
    handleStoreLogoError(img, img.alt);
    return;
  }
  img.src = '/static/images/placeholder-product.svg';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   CLIENT SEARCH & CATALOG ENGINE
   ============================================================ */
function clientSearch(query) {
  const qLower = query.toLowerCase().trim();
  const qTokens = qLower.split(/\s+/).filter(Boolean);

  const scored = EMBEDDED_CATALOG.products.map(p => {
    let score = 0;
    const nameLower = p.name.toLowerCase();
    const catLower = p.category.toLowerCase();
    const kwLower = (p.keywords || '').toLowerCase();
    const descLower = (p.description || '').toLowerCase();

    if (nameLower === qLower) score += 150;
    else if (nameLower.startsWith(qLower)) score += 100;
    else if (nameLower.includes(qLower)) score += 80;

    if (catLower.includes(qLower)) score += 60;
    if (kwLower.includes(qLower)) score += 50;

    for (const t of qTokens) {
      if (nameLower.includes(t)) score += 25;
      if (kwLower.includes(t)) score += 15;
      if (descLower.includes(t)) score += 10;
    }
    return { ...p, score };
  }).filter(p => p.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function clientGetProductPrices(productId) {
  const prod = EMBEDDED_CATALOG.products.find(p => p.id === Number(productId)) || EMBEDDED_CATALOG.products[0];
  const lowest = prod.lowest_price;
  const highest = prod.highest_price || Math.round(lowest * 1.15);
  const avg = prod.average_price || Math.round((lowest + highest) / 2);
  const potentialSave = Math.max(0, highest - lowest) || Math.round(lowest * 0.1);

  let stores = [];
  const catLower = (prod.category || '').toLowerCase();
  if (catLower.includes('fashion') || catLower.includes('sports')) {
    stores = [
      { store_id: 1, store: "Amazon", logo: "/static/images/stores/amazon.svg", price: lowest, original_price: Math.round(lowest * 1.18), discount: 16, rating: 4.8, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: true, url: "https://www.amazon.in" },
      { store_id: 2, store: "Flipkart", logo: "/static/images/stores/flipkart.svg", price: Math.round(lowest * 1.02), original_price: Math.round(lowest * 1.18), discount: 14, rating: 4.6, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: false, url: "https://flipkart.com" },
      { store_id: 6, store: "Myntra", logo: "/static/images/stores/myntra.svg", price: Math.round(lowest * 1.04), original_price: Math.round(lowest * 1.18), discount: 12, rating: 4.6, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: false, url: "https://myntra.com" },
      { store_id: 3, store: "Meesho", logo: "/static/images/stores/meesho.svg", price: highest, original_price: Math.round(lowest * 1.18), discount: 10, rating: 4.3, availability: "In Stock", delivery: "Free · 3–4 days delivery", is_best_price: false, url: "https://meesho.com" }
    ];
  } else if (catLower.includes('beauty') || catLower.includes('fragrance')) {
    stores = [
      { store_id: 1, store: "Amazon", logo: "/static/images/stores/amazon.svg", price: lowest, original_price: Math.round(lowest * 1.18), discount: 16, rating: 4.8, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: true, url: "https://www.amazon.in" },
      { store_id: 2, store: "Flipkart", logo: "/static/images/stores/flipkart.svg", price: Math.round(lowest * 1.01), original_price: Math.round(lowest * 1.18), discount: 15, rating: 4.6, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: false, url: "https://flipkart.com" },
      { store_id: 7, store: "Nykaa", logo: "/static/images/stores/nykaa.svg", price: Math.round(lowest * 1.03), original_price: Math.round(lowest * 1.18), discount: 13, rating: 4.8, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: false, url: "https://nykaa.com" },
      { store_id: 4, store: "Blinkit", logo: "/static/images/stores/blinkit.svg", price: highest, original_price: Math.round(lowest * 1.18), discount: 12, rating: 4.7, availability: "In Stock", delivery: "10–15 mins delivery", is_best_price: false, url: "https://blinkit.com" }
    ];
  } else if (catLower.includes('grocery') || catLower.includes('household')) {
    stores = [
      { store_id: 4, store: "Blinkit", logo: "/static/images/stores/blinkit.svg", price: lowest, original_price: Math.round(lowest * 1.18), discount: 16, rating: 4.7, availability: "In Stock", delivery: "10–15 mins delivery", is_best_price: true, url: "https://blinkit.com" },
      { store_id: 5, store: "Zepto", logo: "/static/images/stores/zepto.svg", price: Math.round(lowest * 1.01), original_price: Math.round(lowest * 1.18), discount: 15, rating: 4.7, availability: "In Stock", delivery: "10–15 mins delivery", is_best_price: false, url: "https://zeptonow.com" },
      { store_id: 1, store: "Amazon", logo: "/static/images/stores/amazon.svg", price: Math.round(lowest * 1.03), original_price: Math.round(lowest * 1.18), discount: 14, rating: 4.8, availability: "In Stock", delivery: "Free · 1–2 days delivery", is_best_price: false, url: "https://www.amazon.in" },
      { store_id: 2, store: "Flipkart", logo: "/static/images/stores/flipkart.svg", price: highest, original_price: Math.round(lowest * 1.18), discount: 12, rating: 4.6, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: false, url: "https://flipkart.com" }
    ];
  } else {
    stores = [
      { store_id: 1, store: "Amazon", logo: "/static/images/stores/amazon.svg", price: lowest, original_price: Math.round(lowest * 1.18), discount: 16, rating: 4.8, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: true, url: "https://www.amazon.in" },
      { store_id: 2, store: "Flipkart", logo: "/static/images/stores/flipkart.svg", price: Math.round(lowest * 1.01), original_price: Math.round(lowest * 1.18), discount: 15, rating: 4.6, availability: "In Stock", delivery: "Free · 2–3 days delivery", is_best_price: false, url: "https://flipkart.com" },
      { store_id: 4, store: "Blinkit", logo: "/static/images/stores/blinkit.svg", price: Math.round(lowest * 1.02), original_price: Math.round(lowest * 1.18), discount: 14, rating: 4.7, availability: "In Stock", delivery: "10–15 mins delivery", is_best_price: false, url: "https://blinkit.com" },
      { store_id: 3, store: "Meesho", logo: "/static/images/stores/meesho.svg", price: highest, original_price: Math.round(lowest * 1.18), discount: 13, rating: 4.3, availability: "In Stock", delivery: "Free · 3–4 days delivery", is_best_price: false, url: "https://meesho.com" }
    ];
  }

  return {
    id: prod.id,
    product_id: prod.id,
    product: prod.name,
    category: prod.category,
    image: prod.image,
    rating: prod.rating,
    reviews: prod.reviews,
    description: prod.description,
    lowest_price: lowest,
    highest_price: highest,
    average_price: avg,
    potential_saving: potentialSave,
    stores
  };
}

/* ============================================================
   CATEGORIES
   ============================================================ */
async function initCategories() {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.categories) && data.categories.length > 0) {
        AppState.categories = data.categories;
        renderCategories(data.categories);
        return;
      }
    }
  } catch (err) {
    // Non-blocking fallback
  }
  renderCategories(EMBEDDED_CATALOG.categories);
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
    card.className = `category-card ${cat.id === 1 ? 'active' : ''}`;
    card.dataset.id = cat.id;
    card.innerHTML = `
      <div class="category-icon-box">${iconMap[cat.slug] || '🏷️'}</div>
      <div class="category-name">${escapeHtml(cat.name)}</div>
      <div class="category-count">${cat.product_count || cat.count || 8} Products</div>
    `;
    card.addEventListener('click', () => selectCategory(cat.id, card));
    categoriesGrid.appendChild(card);
  });
}

async function selectCategory(catId, cardEl) {
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
  if (cardEl) {
    cardEl.classList.add('active');
  } else {
    const el = document.querySelector(`.category-card[data-id="${catId}"]`);
    if (el) el.classList.add('active');
  }

  let products = [];
  try {
    const res = await fetch(`/api/categories/${catId}/products`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.products) {
        products = data.products;
      }
    }
  } catch (err) {}

  if (products.length === 0) {
    products = EMBEDDED_CATALOG.products.filter(p => p.category_id === Number(catId));
  }

  const cat = EMBEDDED_CATALOG.categories.find(c => c.id === Number(catId)) || { name: 'Category' };
  renderSearchResults(products, `Category: ${cat.name}`);
  if (products[0]) {
    selectProduct(products[0].id, false);
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

  let results = [];
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.results)) {
        results = data.results;
      }
    }
  } catch (err) {}

  if (results.length === 0) {
    results = clientSearch(query);
  }

  if (results.length > 0) {
    renderSearchResults(results, query);
    selectProduct(results[0].id, false);
  } else {
    renderEmptyState(query);
  }
}

function renderSearchResults(products, query) {
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

  const currentId = AppState.currentProduct ? (AppState.currentProduct.id || AppState.currentProduct.product_id) : (products[0] ? products[0].id : null);

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
          <h4 class="product-card-title">${escapeHtml(p.name)}</h4>
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
    card.addEventListener('click', () => selectProduct(p.id, true));
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
  let data = null;
  try {
    const res = await fetch(`/api/products/${productId}/prices`);
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {}

  if (!data || data.error) {
    data = clientGetProductPrices(productId);
  }

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
}

function renderProductDetail(prod) {
  const imgEl = document.getElementById('detailProductImage');
  const catEl = document.getElementById('detailCategoryBadge');
  const titleEl = document.getElementById('detailProductTitle');
  const ratingEl = document.getElementById('detailRatingText');
  const descEl = document.getElementById('detailProductDesc');
  const lowEl = document.getElementById('detailLowestPrice');
  const avgEl = document.getElementById('detailAvgPrice');
  const saveEl = document.getElementById('detailPotentialSaving');

  if (imgEl) {
    imgEl.src = prod.image || '/static/images/placeholder-product.svg';
    imgEl.alt = prod.product || prod.name;
  }
  if (catEl) catEl.textContent = prod.category || 'Product';
  if (titleEl) titleEl.textContent = prod.product || prod.name;
  if (ratingEl) {
    ratingEl.innerHTML = `<span class="star-rating">★ ${prod.rating}</span> · ${Number(prod.reviews).toLocaleString()} ratings across verified stores`;
  }
  if (descEl) descEl.textContent = prod.description || '';
  if (lowEl) lowEl.textContent = formatINR(prod.lowest_price);
  if (avgEl) avgEl.textContent = formatINR(prod.average_price);
  if (saveEl) saveEl.textContent = formatINR(prod.potential_saving);

  // Update Alert Modal text
  if (alertProductTitle) {
    alertProductTitle.textContent = prod.product || prod.name;
  }
  if (alertTargetPriceInput) {
    alertTargetPriceInput.value = Math.round(prod.lowest_price * 0.95);
  }
}

function renderStoreCards(stores, lowestPrice) {
  if (!storeCardsGrid) return;
  storeCardsGrid.innerHTML = '';

  const sortedStores = [...stores].sort((a, b) => a.price - b.price);

  sortedStores.forEach(s => {
    const isBest = (s.price === lowestPrice) || s.is_best_price;
    const card = document.createElement('div');
    card.className = `store-card ${isBest ? 'best-price-card' : ''}`;

    const bestBadge = isBest ? '<span class="badge-pill badge-best-price store-card-badge">★ BEST PRICE</span>' : '';
    const origPriceHtml = s.original_price > s.price ? `
      <div class="store-orig-price-row">
        <span class="store-orig-price">${formatINR(s.original_price)}</span>
        <span class="store-discount-badge">${s.discount}% OFF</span>
      </div>
    ` : '';

    card.innerHTML = `
      ${bestBadge}
      <div>
        <div class="store-card-top">
          <div class="store-logo-wrapper" title="${escapeHtml(s.store || s.name || '')}">
            ${getStoreLogoHtml(s.store || s.name, s.logo)}
          </div>
          <span class="store-rating-badge">★ ${s.store_rating || s.rating || 4.5}</span>
        </div>
        <div class="store-price-block">
          <div class="store-current-price">${formatINR(s.price)}</div>
          ${origPriceHtml}
        </div>
        <div class="store-logistics">
          <div class="stock-indicator">
            <span class="stock-dot"></span>
            <span>${s.availability || 'In Stock'}</span>
          </div>
          <div class="delivery-text">${s.delivery || 'Free · 2–3 days'}</div>
        </div>
      </div>
      <a href="${s.product_url || s.url || '#'}" target="_blank" rel="noopener noreferrer" class="btn ${isBest ? 'btn-primary' : 'btn-secondary'} btn-deal">
        <span>Go to ${escapeHtml(s.store)}</span>
        <span>↗</span>
      </a>
    `;
    storeCardsGrid.appendChild(card);
  });
}

/* ============================================================
   PRICE HISTORY CHART & INSIGHTS
   ============================================================ */
async function loadPriceHistory(productId, timeframe = '30d') {
  let data = null;
  try {
    const res = await fetch(`/api/products/${productId}/history?timeframe=${timeframe}`);
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {}

  if (!data || !data.history) {
    const prod = EMBEDDED_CATALOG.products.find(p => p.id === Number(productId)) || EMBEDDED_CATALOG.products[0];
    const days = timeframe === '1y' ? 365 : timeframe === '6m' ? 180 : timeframe === '90d' ? 90 : 30;
    const count = 5;
    const history = [];
    const now = Date.now();
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now - i * (days / count) * 86400000);
      const mult = i === 0 ? 1.0 : (1 + Math.sin(i * 1.5) * 0.06);
      history.push({
        price: Math.round(prod.lowest_price * mult),
        recorded_at: d.toISOString(),
        store: "Amazon"
      });
    }
    data = {
      product: prod.name,
      history,
      lowest: prod.lowest_price,
      highest: Math.round(prod.lowest_price * 1.1),
      average: Math.round(prod.lowest_price * 1.04),
      insight: `Great time to buy! The current lowest price is ${formatINR(Math.round(prod.lowest_price * 0.04))} below average.`,
      badge: "GOOD DEAL"
    };
  }

  renderPriceHistoryChart(data.history, data.product);
  renderPriceInsights(data);
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

  const gradient = ctx.createLinearGradient(0, 0, 0, 260);
  gradient.addColorStop(0, 'rgba(199, 125, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(123, 44, 191, 0.01)');

  if (typeof Chart === 'undefined') return;

  AppState.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Price (₹)',
        data: dataPoints,
        borderColor: '#C77DFF',
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#9D4EDD',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#180036',
          titleColor: '#E0AAFF',
          bodyColor: '#FFFFFF',
          borderColor: 'rgba(199, 125, 255, 0.3)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(ctx) {
              const item = historyData[ctx.dataIndex];
              return `Price: ₹${ctx.raw.toLocaleString('en-IN')} (${item.store || 'Amazon'})`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#C4B5D9', font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(224, 170, 255, 0.08)' },
          ticks: {
            color: '#C4B5D9',
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
    const diff = Math.max(0, (data.average || 0) - (data.lowest || data.current_lowest || 0));
    saveAmountEl.textContent = formatINR(diff || 1500);
  }
}

/* ============================================================
   PRODUCT TRACKING & PRICE ALERTS
   ============================================================ */
function updateBadgeCounts() {
  const tBadge = document.getElementById('trackedNavBadge');
  const aBadge = document.getElementById('alertsNavBadge');
  if (tBadge) tBadge.textContent = AppState.trackedProducts.length;
  if (aBadge) aBadge.textContent = AppState.priceAlerts.length;
}

window.handleTrackCurrentProduct = function() {
  if (!AppState.currentProduct) return;
  const pId = AppState.currentProduct.id || AppState.currentProduct.product_id;
  if (AppState.trackedProducts.includes(pId)) {
    showToast('Product is already in your tracking list!', 'error');
    return;
  }
  AppState.trackedProducts.push(pId);
  localStorage.setItem('pricewise_tracked', JSON.stringify(AppState.trackedProducts));
  updateBadgeCounts();
  showToast(`${AppState.currentProduct.product || AppState.currentProduct.name} is now tracked!`, 'success');
};

window.handleOpenAlertModal = function() {
  if (alertModal) alertModal.classList.add('active');
};

window.handleCloseAlertModal = function() {
  if (alertModal) alertModal.classList.remove('active');
};

window.handleSubmitPriceAlert = function(e) {
  e.preventDefault();
  const targetVal = Number(alertTargetPriceInput.value);
  if (!targetVal || !AppState.currentProduct) return;

  const newAlert = {
    id: Date.now(),
    product_id: AppState.currentProduct.id || AppState.currentProduct.product_id,
    target_price: targetVal,
    status: 'Active',
    created_at: new Date().toLocaleDateString()
  };

  AppState.priceAlerts.push(newAlert);
  localStorage.setItem('pricewise_alerts', JSON.stringify(AppState.priceAlerts));
  updateBadgeCounts();
  handleCloseAlertModal();
  showToast(`Price alert set for ₹${targetVal.toLocaleString('en-IN')}!`, 'success');
};

window.handleOpenTrackedModal = function() {
  const listEl = document.getElementById('trackedItemsList');
  if (!listEl) return;
  listEl.innerHTML = '';

  const trackedList = EMBEDDED_CATALOG.products.filter(p => AppState.trackedProducts.includes(p.id));

  if (trackedList.length === 0) {
    listEl.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:20px;">No tracked products yet. Click "Track Product" on any item!</div>';
  } else {
    trackedList.forEach(p => {
      const item = document.createElement('div');
      item.className = 'data-item';
      item.innerHTML = `
        <img class="data-item-img" src="${p.image}" alt="${escapeHtml(p.name)}" onerror="handleImageError(this)" />
        <div class="data-item-info">
          <div class="data-item-title">${escapeHtml(p.name)}</div>
          <div class="data-item-price">Lowest: ${formatINR(p.lowest_price)}</div>
        </div>
        <button class="data-item-remove-btn" onclick="handleRemoveTracked(${p.id})">✕ Remove</button>
      `;
      listEl.appendChild(item);
    });
  }

  if (trackedModal) trackedModal.classList.add('active');
};

window.handleCloseTrackedModal = function() {
  if (trackedModal) trackedModal.classList.remove('active');
};

window.handleRemoveTracked = function(pId) {
  AppState.trackedProducts = AppState.trackedProducts.filter(id => id !== pId);
  localStorage.setItem('pricewise_tracked', JSON.stringify(AppState.trackedProducts));
  updateBadgeCounts();
  handleOpenTrackedModal();
  showToast('Product removed from tracking', 'info');
};

window.handleOpenAlertsListModal = function() {
  const listEl = document.getElementById('activeAlertsList');
  if (!listEl) return;
  listEl.innerHTML = '';

  if (AppState.priceAlerts.length === 0) {
    listEl.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:20px;">No active price alerts set yet.</div>';
  } else {
    AppState.priceAlerts.forEach(a => {
      const prod = EMBEDDED_CATALOG.products.find(p => p.id === a.product_id) || { name: 'Product', lowest_price: 0, image: '/static/images/placeholder-product.svg' };
      const item = document.createElement('div');
      item.className = 'data-item';
      item.innerHTML = `
        <img class="data-item-img" src="${prod.image}" alt="${escapeHtml(prod.name)}" onerror="handleImageError(this)" />
        <div class="data-item-info">
          <div class="data-item-title">${escapeHtml(prod.name)}</div>
          <div class="data-item-price">Target: ${formatINR(a.target_price)} (Current: ${formatINR(prod.lowest_price)})</div>
        </div>
        <button class="data-item-remove-btn" onclick="handleDeleteAlert(${a.id})">✕ Remove</button>
      `;
      listEl.appendChild(item);
    });
  }

  if (alertsListModal) alertsListModal.classList.add('active');
};

window.handleCloseAlertsListModal = function() {
  if (alertsListModal) alertsListModal.classList.remove('active');
};

window.handleDeleteAlert = function(alertId) {
  AppState.priceAlerts = AppState.priceAlerts.filter(a => a.id !== alertId);
  localStorage.setItem('pricewise_alerts', JSON.stringify(AppState.priceAlerts));
  updateBadgeCounts();
  handleOpenAlertsListModal();
  showToast('Alert removed', 'info');
};
