import express from 'express';
import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import {
  searchProductsFallback,
  getProductFallback,
  getProductPricesFallback,
  getProductHistoryFallback,
  getCategoriesFallback,
  getCategoryProductsFallback,
  trackProductFallback,
  untrackProductFallback,
  getTrackedProductsFallback,
  createAlertFallback,
  deleteAlertFallback,
  getAlertsFallback
} from './catalog_fallback.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Serve static assets with highest priority from all valid distribution paths
app.use('/static', express.static(path.join(__dirname, 'dist', 'static')));
app.use('/static', express.static(path.join(__dirname, 'public', 'static')));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Helper to execute Python CLI bridge with graceful fallback
function runPythonBridge(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'api_cli.py');
    if (!fs.existsSync(pythonScript)) {
      return reject(new Error('api_cli.py not found'));
    }
    execFile('python3', [pythonScript, ...args], { maxBuffer: 10 * 1024 * 1024, timeout: 6000 }, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

// 1. Search products
app.get('/api/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.json({ results: [], query: '', message: "Query parameter 'q' is required" });
  }
  try {
    const data = await runPythonBridge(['search', q]);
    if (data && Array.isArray(data.results)) {
      return res.json(data);
    }
  } catch (err) {
    // Graceful TypeScript in-memory fallback
  }
  return res.json(searchProductsFallback(q));
});

// 2. Product details
app.get('/api/products/:id', async (req, res) => {
  const idNum = parseInt(req.params.id, 10);
  try {
    const data = await runPythonBridge(['get_product', req.params.id]);
    if (data && !data.error) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  const fallback = getProductFallback(idNum);
  if (!fallback) return res.status(404).json({ error: 'Product not found' });
  return res.json(fallback);
});

// 3. Product store prices comparison
app.get('/api/products/:id/prices', async (req, res) => {
  const idNum = parseInt(req.params.id, 10);
  try {
    const data = await runPythonBridge(['get_prices', req.params.id]);
    if (data && !data.error) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  const fallback = getProductPricesFallback(idNum);
  if (!fallback) return res.status(404).json({ error: 'Product not found' });
  return res.json(fallback);
});

// 4. Product price history
app.get('/api/products/:id/history', async (req, res) => {
  const idNum = parseInt(req.params.id, 10);
  const timeframe = String(req.query.timeframe || '30d');
  try {
    const data = await runPythonBridge(['get_history', req.params.id, timeframe]);
    if (data && !data.error) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  const fallback = getProductHistoryFallback(idNum, timeframe);
  if (!fallback) return res.status(404).json({ error: 'Product not found' });
  return res.json(fallback);
});

// 5. Categories list
app.get('/api/categories', async (_req, res) => {
  try {
    const data = await runPythonBridge(['get_categories']);
    if (data && Array.isArray(data.categories)) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  return res.json(getCategoriesFallback());
});

// 6. Category products
app.get('/api/categories/:id/products', async (req, res) => {
  const catId = parseInt(req.params.id, 10);
  try {
    const data = await runPythonBridge(['get_category_products', req.params.id]);
    if (data && !data.error) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  const fallback = getCategoryProductsFallback(catId);
  if (!fallback) return res.status(404).json({ error: 'Category not found' });
  return res.json(fallback);
});

// 7. Track product (POST)
app.post('/api/track', async (req, res) => {
  const { product_id } = req.body || {};
  if (!product_id) return res.status(400).json({ error: 'product_id is required' });
  const pId = parseInt(String(product_id), 10);
  try {
    const data = await runPythonBridge(['track', String(product_id)]);
    if (data && !data.error) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  return res.json(trackProductFallback(pId));
});

// Untrack product (DELETE)
app.delete('/api/track/:id', async (req, res) => {
  const pId = parseInt(req.params.id, 10);
  try {
    const data = await runPythonBridge(['untrack', req.params.id]);
    if (data && !data.error) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  return res.json(untrackProductFallback(pId));
});

// 8. Get tracked products (GET)
app.get('/api/tracked', async (_req, res) => {
  try {
    const data = await runPythonBridge(['get_tracked']);
    if (data && Array.isArray(data.tracked_products)) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  return res.json(getTrackedProductsFallback());
});

// 9. Create price alert (POST)
app.post('/api/alerts', async (req, res) => {
  const { product_id, target_price } = req.body || {};
  if (!product_id || target_price === undefined) {
    return res.status(400).json({ error: 'product_id and target_price are required' });
  }
  const pId = parseInt(String(product_id), 10);
  const tPrice = parseFloat(target_price);
  try {
    const data = await runPythonBridge(['create_alert', String(product_id), String(target_price)]);
    if (data && !data.error) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  return res.json(createAlertFallback(pId, tPrice));
});

// Delete price alert (DELETE)
app.delete('/api/alerts/:id', async (req, res) => {
  const aId = parseInt(req.params.id, 10);
  try {
    const data = await runPythonBridge(['delete_alert', req.params.id]);
    if (data && !data.error) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  return res.json(deleteAlertFallback(aId));
});

// 10. Get price alerts (GET)
app.get('/api/alerts', async (_req, res) => {
  try {
    const data = await runPythonBridge(['get_alerts']);
    if (data && Array.isArray(data.alerts)) return res.json(data);
  } catch (err) {
    // Graceful TypeScript fallback
  }
  return res.json(getAlertsFallback());
});

async function startServer() {
  const distDir = path.join(__dirname, 'dist');
  const distExists = fs.existsSync(path.join(distDir, 'index.html'));

  if (process.env.NODE_ENV === 'production' || distExists) {
    console.log('Serving production static build from dist/...');
    app.use(express.static(distDir));
    app.get('*', (req, res) => {
      // Guard against returning HTML for missing static files (prevents MIME type errors)
      if (path.extname(req.path)) {
        return res.status(404).send('Asset not found');
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite middleware could not start, serving index.html directly:', err);
      app.use(express.static(__dirname));
      app.get('*', (req, res) => {
        if (path.extname(req.path)) {
          return res.status(404).send('Asset not found');
        }
        res.sendFile(path.join(__dirname, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PriceWise Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
