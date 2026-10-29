/**
 * PriceWise - In-Memory TypeScript Catalog & Search Engine
 * Provides instant, zero-dependency data fallback when Python or SQLite is not available in deployment.
 */

export interface Store {
  id: number;
  name: string;
  logo: string;
  website: string;
  rating: number;
}

export interface StorePrice {
  id: number;
  product_id: number;
  store_id: number;
  store: string;
  logo: string;
  website: string;
  store_rating: number;
  price: number;
  original_price: number;
  discount: number;
  availability: string;
  delivery: string;
  product_url: string;
  is_best_price?: boolean;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  category: string;
  description: string;
  keywords: string;
  rating: number;
  reviews: number;
  image: string;
  lowest_price: number;
  highest_price: number;
  average_price: number;
  potential_saving: number;
  stores_count: number;
  score?: number;
}

export const STORES: Store[] = [
  { id: 1, name: "Amazon", logo: "/static/images/stores/amazon.svg", website: "https://www.amazon.in", rating: 4.8 },
  { id: 2, name: "Flipkart", logo: "/static/images/stores/flipkart.svg", website: "https://flipkart.com", rating: 4.6 },
  { id: 3, name: "Meesho", logo: "/static/images/stores/meesho.svg", website: "https://meesho.com", rating: 4.3 },
  { id: 4, name: "Blinkit", logo: "/static/images/stores/blinkit.svg", website: "https://blinkit.com", rating: 4.7 },
  { id: 5, name: "Zepto", logo: "/static/images/stores/zepto.svg", website: "https://zeptonow.com", rating: 4.7 },
  { id: 6, name: "Myntra", logo: "/static/images/stores/myntra.svg", website: "https://myntra.com", rating: 4.6 },
  { id: 7, name: "Nykaa", logo: "/static/images/stores/nykaa.svg", website: "https://nykaa.com", rating: 4.8 }
];

export const CATEGORIES = [
  { id: 1, name: "Electronics", slug: "electronics", icon: "laptop", description: "Smartphones, Laptops, Audio & Gadgets", product_count: 11 },
  { id: 2, name: "Beauty & Personal Care", slug: "beauty-personal-care", icon: "sparkles", description: "Skincare, Haircare, Oral Care & Cosmetics", product_count: 12 },
  { id: 3, name: "Fragrance", slug: "fragrance", icon: "spray-can", description: "Perfumes, Deodorants, Body Mists & Colognes", product_count: 10 },
  { id: 4, name: "Household", slug: "household", icon: "home", description: "Cleaners, Detergents, Paper & Home Care", product_count: 8 },
  { id: 5, name: "Grocery", slug: "grocery", icon: "shopping-cart", description: "Daily Essentials, Staples, Coffee, Tea & Snacks", product_count: 9 },
  { id: 6, name: "Sports", slug: "sports", icon: "trophy", description: "Cricket, Football, Badminton, Shoes & Gear", product_count: 9 },
  { id: 7, name: "Fashion", slug: "fashion", icon: "shirt", description: "Clothing, Footwear, Bags & Accessories", product_count: 6 }
];

interface RawProductData {
  id: number;
  name: string;
  catId: number;
  cat: string;
  desc: string;
  keywords: string;
  rating: number;
  reviews: number;
  image: string;
  stores: [number, number, number][]; // [store_id, price, orig_price]
}

const RAW_PRODUCTS: RawProductData[] = [
  // Electronics
  {
    id: 1, name: "Apple iPhone 15", catId: 1, cat: "Electronics",
    desc: "Apple iPhone 15 (128 GB) featuring Dynamic Island, 48MP main camera, USB-C, and all-day battery life powered by A16 Bionic chip.",
    keywords: "apple iphone 15 iphon phone smartphone ios mobile 128gb dynamic island electronics a16",
    rating: 4.8, reviews: 14200,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 58999, 79900], [2, 60499, 79900], [3, 62999, 79900]]
  },
  {
    id: 2, name: "Samsung Galaxy S24 Ultra", catId: 1, cat: "Electronics",
    desc: "Flagship Samsung Galaxy S24 Ultra 5G with AI Photo Assist, Snapdragon 8 Gen 3, Titanium Frame, and embedded S-Pen.",
    keywords: "samsung galaxy phone s24 ultra android smartphone mobile camera 5g galaxy phone electronics",
    rating: 4.7, reviews: 8940,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 119999, 134999], [2, 118499, 134999], [6, 122999, 134999]]
  },
  {
    id: 3, name: "OnePlus 12 5G", catId: 1, cat: "Electronics",
    desc: "OnePlus 12 with 4th Gen Hasselblad Camera, Snapdragon 8 Gen 3, 100W SUPERVOOC charging, and 2K ProXDR Display.",
    keywords: "oneplus phone 12 one plus smartphone android mobile 5g oxygenos fast charging electronics",
    rating: 4.6, reviews: 6120,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 64999, 69999], [2, 63999, 69999]]
  },
  {
    id: 4, name: "Apple MacBook Air M3", catId: 1, cat: "Electronics",
    desc: "13.6-inch Liquid Retina Display, 8GB Unified Memory, 256GB SSD, backlit Magic Keyboard, 18-hour battery.",
    keywords: "macbook air apple mac laptop notebook m2 m3 computer macos macbook air pro electronics",
    rating: 4.9, reviews: 5800,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 98990, 114900], [2, 99990, 114900]]
  },
  {
    id: 5, name: "HP Laptop 15s", catId: 1, cat: "Electronics",
    desc: "HP 15s Intel Core i5 12th Gen, 16GB DDR4 RAM, 512GB NVMe SSD, 15.6-inch FHD Micro-Edge Anti-Glare Display.",
    keywords: "hp laptop 15s notebook intel core i5 computer windows pc electronics",
    rating: 4.4, reviews: 4310,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 52990, 64990], [2, 51490, 64990], [3, 50999, 64990]]
  },
  {
    id: 6, name: "Dell Laptop XPS 13", catId: 1, cat: "Electronics",
    desc: "Dell XPS 13 Ultrabook with Intel Core Ultra 7, InfinityEdge Touch Display, CNC Aluminum chassis and Wi-Fi 7.",
    keywords: "dell laptop xps 13 notebook ultrabook portable computer pc electronics",
    rating: 4.6, reviews: 3210,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 134990, 149990], [2, 132990, 149990]]
  },
  {
    id: 7, name: "Sony WH-1000XM5", catId: 1, cat: "Electronics",
    desc: "Industry Leading Wireless Noise Cancelling Headphones with Auto NC Optimizer, 30hr battery, crystal clear hands-free calling.",
    keywords: "sony wh-1000xm5 headphones headphnes audio wireless bluetooth over ear anc headset electronics",
    rating: 4.8, reviews: 9150,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 25990, 34990], [2, 26490, 34990], [7, 27990, 34990]]
  },
  {
    id: 8, name: "boAt Rockerz 550 Wireless", catId: 1, cat: "Electronics",
    desc: "boAt Rockerz 550 Over-Ear Wireless Headphones with 50mm dynamic drivers, 20 hours playback, and plush ear cushions.",
    keywords: "boat headphones boat rockerz wireless bluetooth audio headset bass sound electronics",
    rating: 4.3, reviews: 18500,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 1799, 4999], [2, 1699, 4999], [3, 1549, 4999], [4, 1899, 4999]]
  },
  {
    id: 9, name: "Apple Watch Series 9", catId: 1, cat: "Electronics",
    desc: "Apple Watch with S9 SiP, Double Tap gesture control, brighter Always-On Retina display, ECG and blood oxygen monitoring.",
    keywords: "apple smartwatch watch series 9 fitness tracker wearable health monitor electronics",
    rating: 4.7, reviews: 7200,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 37999, 41900], [2, 38499, 41900], [6, 39999, 41900]]
  },
  {
    id: 10, name: "Apple iPad Air 11-inch", catId: 1, cat: "Electronics",
    desc: "iPad Air with M2 chip, Liquid Retina display, Touch ID, Landscape front camera, Wi-Fi 6E, and Apple Pencil Pro support.",
    keywords: "apple ipad tablet ios air m2 touch screen slate portable computer electronics",
    rating: 4.8, reviews: 5420,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 56990, 59900], [2, 57490, 59900]]
  },
  {
    id: 11, name: "Samsung 55-inch Crystal 4K TV", catId: 1, cat: "Electronics",
    desc: "Samsung 138 cm (55 inches) Crystal 4K Vivid Pro Ultra HD Smart LED TV with PurColor, OTS Lite, and Motion Xcelerator.",
    keywords: "samsung tv television smart tv 4k uhd 55 inch display home theater screen electronics",
    rating: 4.5, reviews: 6800,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 41990, 64900], [2, 40990, 64900]]
  },

  // Beauty & Personal Care
  {
    id: 12, name: "Colgate MaxFresh Peppermint", catId: 2, cat: "Beauty & Personal Care",
    desc: "Colgate MaxFresh Toothpaste with cooling crystals for intense freshness, cavity protection, and icy peppermint burst.",
    keywords: "colgate colgat maxfresh toothpaste tooth paste dental peppermint oral care hygiene brush",
    rating: 4.6, reviews: 24500,
    image: "https://images.unsplash.com/photo-1559591937-e62fb330bc1f?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 110, 130], [2, 112, 130], [4, 105, 130], [5, 108, 130], [7, 115, 130]]
  },
  {
    id: 13, name: "Colgate Strong Teeth", catId: 2, cat: "Beauty & Personal Care",
    desc: "Colgate Strong Teeth Anticavity Toothpaste with Amino Power for 2x stronger teeth and long-lasting calcium boost.",
    keywords: "colgate colgat strong teeth toothpaste dental cream oral hygiene tooth paste teeth",
    rating: 4.5, reviews: 31000,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 135, 160], [2, 138, 160], [4, 129, 160], [5, 132, 160]]
  },
  {
    id: 14, name: "Clean & Clear Face Wash", catId: 2, cat: "Beauty & Personal Care",
    desc: "Clean & Clear Foaming Face Wash specially formulated for oily skin with oil-free salicylic formula that won't clog pores.",
    keywords: "clean & clear clean clear clenis face wash facewash foaming skin beauty cleanser acne oil control skincare",
    rating: 4.5, reviews: 18200,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 220, 250], [2, 215, 250], [7, 199, 250], [4, 210, 250], [5, 205, 250]]
  },
  {
    id: 15, name: "Nivea Face Wash Dark Spot", catId: 2, cat: "Beauty & Personal Care",
    desc: "Nivea Men Dark Spot Reduction 10x Face Wash with Whitanat Vita Complex Plus for clean and revitalized masculine skin.",
    keywords: "nivea face wash facewash men dark spot reduction skin cleanser grooming beauty",
    rating: 4.4, reviews: 14300,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 175, 225], [2, 170, 225], [7, 180, 225], [4, 165, 225], [5, 168, 225]]
  },
  {
    id: 16, name: "Himalaya Neem Face Wash", catId: 2, cat: "Beauty & Personal Care",
    desc: "Himalaya Purifying Neem Face Wash enriched with Neem and Turmeric to prevent pimples and purify skin naturally.",
    keywords: "himalaya face wash facewash neem herbal natural ayurvedic skin acne cleanser beauty",
    rating: 4.6, reviews: 42000,
    image: "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 260, 350], [2, 255, 350], [4, 240, 350], [5, 245, 350], [7, 265, 350]]
  },
  {
    id: 17, name: "L'Oreal Total Repair Shampoo", catId: 2, cat: "Beauty & Personal Care",
    desc: "L'Oreal Paris Total Repair 5 Shampoo formulated with Ceramide-Cement to fight the 5 signs of damaged hair.",
    keywords: "loreal l'oreal shampoo shampu total repair hair wash hair care conditioner beauty",
    rating: 4.5, reviews: 19800,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 419, 599], [2, 429, 599], [7, 399, 599], [4, 449, 599]]
  },
  {
    id: 18, name: "Dove Daily Moisture Shampoo", catId: 2, cat: "Beauty & Personal Care",
    desc: "Dove Daily Moisture Shampoo with Bio-Nourish Complex leaves hair silky smooth, deeply moisturized, and manageable.",
    keywords: "dove shampoo shampu daily moisture hair wash moisturizing soft hair care beauty",
    rating: 4.6, reviews: 28300,
    image: "https://images.unsplash.com/photo-1608248597359-5613531b4632?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 385, 499], [2, 390, 499], [7, 375, 499], [4, 380, 499], [5, 379, 499]]
  },

  // Fragrance
  {
    id: 24, name: "Fogg Scent Xtremo EDP", catId: 3, cat: "Fragrance",
    desc: "Fogg Scent Xtremo Eau De Parfum 100ml for Men with long-lasting woody aromatic fragrance notes.",
    keywords: "fogg perfume perfumee fragrance scent xtremo edp deodorant men spray body spray",
    rating: 4.3, reviews: 19200,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 449, 599], [2, 439, 599], [3, 399, 599], [6, 459, 599], [7, 479, 599]]
  },
  {
    id: 25, name: "Engage W1 Perfume Spray", catId: 3, cat: "Fragrance",
    desc: "Engage W1 Perfume Spray for Women offering an exotic blend of citrus and floral notes with zero gas.",
    keywords: "engage perfume perfumee spray women floral citrus deodorant fragrance",
    rating: 4.2, reviews: 11400,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 240, 320], [2, 235, 320], [3, 219, 320], [7, 245, 320]]
  },
  {
    id: 28, name: "Bella Vita Luxury Perfume Set", catId: 3, cat: "Fragrance",
    desc: "Bella Vita Organic Luxury Man Perfume Gift Set with 4 x 20ml miniature bottles (Klub, OUD, White, Fresh).",
    keywords: "bella vita perfume perfumee luxury set fragrance edp gift box men cologne",
    rating: 4.5, reviews: 23100,
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 549, 849], [2, 539, 849], [6, 529, 849], [7, 499, 849]]
  },

  // Household
  {
    id: 34, name: "Surf Excel Matic Liquid Detergent", catId: 4, cat: "Household",
    desc: "Surf Excel Matic Front Load Liquid Detergent 2L with 100% stain removal in 1 wash inside top/front load machines.",
    keywords: "surf excel matic detergent liquid laundry soap washing powder clothes cleaning household",
    rating: 4.7, reviews: 34200,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 410, 480], [2, 415, 480], [4, 385, 480], [5, 389, 480]]
  },

  // Grocery
  {
    id: 44, name: "Bru Instant Coffee 200g", catId: 5, cat: "Grocery",
    desc: "Bru Instant Coffee Granules 200g jar blend of 70% coffee and 30% chicory for rich aroma and authentic South Indian taste.",
    keywords: "bru coffee instant coffee chicory mix hot drink beverage caffeine morning grocery",
    rating: 4.6, reviews: 27400,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 385, 450], [2, 390, 450], [4, 365, 450], [5, 369, 450]]
  },
  {
    id: 45, name: "Nescafe Classic Coffee 200g", catId: 5, cat: "Grocery",
    desc: "Nescafe Classic 100% Pure Instant Coffee 200g glass jar with double filter technology for distinctive rich aroma.",
    keywords: "nescafe coffee instant coffee classic caffeine espresso beverage grocery",
    rating: 4.7, reviews: 39800,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 575, 680], [2, 580, 680], [4, 549, 680], [5, 555, 680]]
  },

  // Sports
  {
    id: 51, name: "SS Master English Willow Cricket Bat", catId: 6, cat: "Sports",
    desc: "SS Master 5000 Handcrafted English Willow Cricket Bat with massive edges, light pickup, and contoured sweet spot.",
    keywords: "cricket bat criket bat english willow sports kashmir willow wood ball match equipment ss master",
    rating: 4.7, reviews: 4800,
    image: "https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 1299, 1599], [2, 1249, 1599], [3, 899, 1599], [6, 1399, 1599]]
  },
  {
    id: 52, name: "Kookaburra Leather Cricket Ball", catId: 6, cat: "Sports",
    desc: "Kookaburra Turf Regulation 4-piece White Leather Cricket Ball with hand-stitched seam for genuine swing and seam.",
    keywords: "cricket ball criket ball white leather ball sports seam match play tournament equipment",
    rating: 4.6, reviews: 3200,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 649, 899], [2, 629, 899], [3, 549, 899]]
  },
  {
    id: 55, name: "Nike Pitch Football Size 5", catId: 6, cat: "Sports",
    desc: "Nike Premier League Pitch Football with 12-panel design, rubber bladder, and high-contrast graphics for easy tracking.",
    keywords: "football ball soccer ball nike pitch sports premier league game team",
    rating: 4.7, reviews: 5900,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 1495, 1995], [2, 1420, 1995], [6, 1399, 1995]]
  },

  // Fashion
  {
    id: 60, name: "Levi's Classic Crewneck T-Shirt", catId: 7, cat: "Fashion",
    desc: "Levi's Men's 100% Pure Combed Cotton Regular Fit Solid Crewneck T-Shirt with subtle batwing chest logo.",
    keywords: "t-shirt tshirt tee shirt cotton levis clothing casual wear men fashion",
    rating: 4.4, reviews: 8200,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 899, 1499], [2, 849, 1499], [6, 799, 1499], [3, 699, 1499]]
  },
  {
    id: 62, name: "Nike Air Zoom Pegasus 40 Shoes", catId: 7, cat: "Fashion",
    desc: "Nike Air Zoom Pegasus 40 Road Running Shoes with dual Zoom Air units and engineered mesh for responsive spring.",
    keywords: "running shoes sneakers nike pegasus athletic shoes footwear sports shoes fashion",
    rating: 4.7, reviews: 7800,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    stores: [[1, 7495, 10495], [2, 7399, 10495], [6, 6999, 10495]]
  }
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map(p => {
  const prices = p.stores.map(s => s[1]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const avgP = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  return {
    id: p.id,
    name: p.name,
    category_id: p.catId,
    category: p.cat,
    description: p.desc,
    keywords: p.keywords,
    rating: p.rating,
    reviews: p.reviews,
    image: p.image,
    lowest_price: minP,
    highest_price: maxP,
    average_price: avgP,
    potential_saving: Math.max(0, maxP - minP),
    stores_count: p.stores.length
  };
});

// In-Memory state for tracking and alerts
let TRACKED_IDS = new Set<number>([1, 14, 51]);
let ALERTS_LIST: { alert_id: number; product_id: number; target_price: number; status: string; created_at: string }[] = [
  { alert_id: 1, product_id: 1, target_price: 55000, status: "Active", created_at: new Date().toISOString() },
  { alert_id: 2, product_id: 51, target_price: 800, status: "Active", created_at: new Date().toISOString() }
];

function clean(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function calculateScore(query: string, p: Product): number {
  const qClean = clean(query);
  const qWords = qClean.split(' ');
  const nameClean = clean(p.name);
  const kwClean = clean(p.keywords);
  const nameWords = new Set(nameClean.split(' '));
  const kwWords = new Set(kwClean.split(' '));

  if (qClean === nameClean) return 150;
  if (nameClean.includes(qClean)) return 100;
  if (kwClean.includes(qClean)) return 85;

  let score = 0;
  let matches = 0;
  for (const w of qWords) {
    if (nameWords.has(w)) {
      score += 40;
      matches++;
    } else if (kwWords.has(w)) {
      score += 25;
      matches++;
    } else {
      // Fuzzy substring check
      for (const nw of nameWords) {
        if (nw.includes(w) || w.includes(nw)) {
          score += 20;
          matches++;
          break;
        }
      }
    }
  }

  if (matches === qWords.length && qWords.length > 1) {
    score += 50;
  }
  return score;
}

export function searchProductsFallback(query: string) {
  const scored = PRODUCTS.map(p => {
    const s = calculateScore(query, p);
    return { ...p, score: s };
  }).filter(p => p.score > 15);

  scored.sort((a, b) => (b.score || 0) - (a.score || 0));

  return {
    results: scored.slice(0, 15),
    query,
    total: scored.length,
    is_url: false
  };
}

export function getProductFallback(id: number) {
  return PRODUCTS.find(p => p.id === id) || null;
}

export function getProductPricesFallback(id: number) {
  const raw = RAW_PRODUCTS.find(p => p.id === id);
  if (!raw) return null;
  const prod = PRODUCTS.find(p => p.id === id)!;

  const storesList: StorePrice[] = raw.stores.map((s, index) => {
    const storeObj = STORES.find(st => st.id === s[0]) || STORES[0];
    const discount = Math.round(((s[2] - s[1]) / s[2]) * 100);
    const isBest = (s[1] === prod.lowest_price);
    return {
      id: index + 1,
      product_id: id,
      store_id: storeObj.id,
      store: storeObj.name,
      logo: storeObj.logo,
      website: storeObj.website,
      store_rating: storeObj.rating,
      price: s[1],
      original_price: s[2],
      discount,
      availability: "In Stock",
      delivery: storeObj.id === 4 || storeObj.id === 5 ? "10–15 mins delivery" : "Free · 2–3 days",
      product_url: `https://example.com/deal/${id}/${storeObj.id}`,
      is_best_price: isBest
    };
  });

  return {
    product_id: prod.id,
    product: prod.name,
    category: prod.category,
    image: prod.image,
    rating: prod.rating,
    reviews: prod.reviews,
    description: prod.description,
    lowest_price: prod.lowest_price,
    highest_price: prod.highest_price,
    average_price: prod.average_price,
    potential_saving: prod.potential_saving,
    stores: storesList
  };
}

export function getProductHistoryFallback(id: number, timeframe = '30d') {
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return null;

  const count = timeframe === '1y' ? 12 : timeframe === '6m' ? 8 : timeframe === '90d' ? 6 : 4;
  const history: { price: number; recorded_at: string; date: string; store: string; logo: string }[] = [];
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const d = new Date(now.getTime() - i * (timeframe === '1y' ? 30 : 7) * 24 * 3600 * 1000);
    const mult = i === 0 ? 1.0 : (1 + (Math.sin(i * 1.5) * 0.08));
    const price = Math.round(prod.lowest_price * mult);
    history.push({
      price,
      recorded_at: d.toISOString(),
      date: d.toISOString().split('T')[0],
      store: "Amazon",
      logo: "/static/images/stores/amazon.svg"
    });
  }

  const prices = history.map(h => h.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const diff = average - prod.lowest_price;

  return {
    product_id: id,
    product: prod.name,
    timeframe,
    history,
    lowest,
    highest,
    average,
    current_lowest: prod.lowest_price,
    potential_saving: prod.potential_saving,
    insight: diff > 0 ? `Great time to buy! The current lowest price is ₹${diff.toLocaleString()} below average.` : "Current price is fair.",
    badge: diff > 0 ? "Good Deal" : "Fair Price"
  };
}

export function getCategoriesFallback() {
  return { categories: CATEGORIES };
}

export function getCategoryProductsFallback(catId: number) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return null;
  const products = PRODUCTS.filter(p => p.category_id === catId);
  return { category: cat, products };
}

export function trackProductFallback(id: number) {
  TRACKED_IDS.add(id);
  return { success: true, message: "Product is now tracked", product_id: id };
}

export function untrackProductFallback(id: number) {
  TRACKED_IDS.delete(id);
  return { success: true, message: "Product untracked", product_id: id };
}

export function getTrackedProductsFallback() {
  const tracked = PRODUCTS.filter(p => TRACKED_IDS.has(p.id)).map(p => ({
    track_id: p.id,
    id: p.id,
    name: p.name,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
    category: p.category,
    lowest_price: p.lowest_price,
    highest_price: p.highest_price,
    average_price: p.average_price,
    price_change: -Math.round(p.lowest_price * 0.05),
    status: "Tracking Active"
  }));
  return { tracked_products: tracked, count: tracked.length };
}

export function createAlertFallback(productId: number, targetPrice: number) {
  const newAlert = {
    alert_id: Date.now(),
    product_id: productId,
    target_price: targetPrice,
    status: "Active",
    created_at: new Date().toISOString()
  };
  ALERTS_LIST.push(newAlert);
  return { success: true, alert_id: newAlert.alert_id, message: `Alert set for target price ₹${targetPrice}` };
}

export function deleteAlertFallback(alertId: number) {
  ALERTS_LIST = ALERTS_LIST.filter(a => a.alert_id !== alertId);
  return { success: true, message: "Alert removed" };
}

export function getAlertsFallback() {
  const alerts = ALERTS_LIST.map(a => {
    const prod = PRODUCTS.find(p => p.id === a.product_id);
    return {
      alert_id: a.alert_id,
      product_id: a.product_id,
      target_price: a.target_price,
      status: a.status,
      created_at: a.created_at,
      name: prod?.name || "Product",
      image: prod?.image || "/static/images/placeholder-product.svg",
      category: prod?.category || "General",
      lowest_price: prod?.lowest_price || 0
    };
  });
  return { alerts, count: alerts.length };
}
