import express from 'express';
import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Serve static assets from /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Helper to execute Python CLI bridge
function runPythonBridge(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    execFile('python3', [path.join(__dirname, 'api_cli.py'), ...args], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        console.error('Python bridge error:', stderr || err.message);
        return reject(err);
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (parseErr) {
        console.error('Failed to parse Python JSON output:', stdout);
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
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message, results: [] });
  }
});

// 2. Product details
app.get('/api/products/:id', async (req, res) => {
  try {
    const data = await runPythonBridge(['get_product', req.params.id]);
    if (data.error) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Product store prices comparison
app.get('/api/products/:id/prices', async (req, res) => {
  try {
    const data = await runPythonBridge(['get_prices', req.params.id]);
    if (data.error) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Product price history
app.get('/api/products/:id/history', async (req, res) => {
  const timeframe = String(req.query.timeframe || '30d');
  try {
    const data = await runPythonBridge(['get_history', req.params.id, timeframe]);
    if (data.error) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Categories list
app.get('/api/categories', async (_req, res) => {
  try {
    const data = await runPythonBridge(['get_categories']);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Category products
app.get('/api/categories/:id/products', async (req, res) => {
  try {
    const data = await runPythonBridge(['get_category_products', req.params.id]);
    if (data.error) return res.status(404).json(data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Track product (POST)
app.post('/api/track', async (req, res) => {
  const { product_id } = req.body || {};
  if (!product_id) return res.status(400).json({ error: 'product_id is required' });
  try {
    const data = await runPythonBridge(['track', String(product_id)]);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Untrack product (DELETE)
app.delete('/api/track/:id', async (req, res) => {
  try {
    const data = await runPythonBridge(['untrack', req.params.id]);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Get tracked products (GET)
app.get('/api/tracked', async (_req, res) => {
  try {
    const data = await runPythonBridge(['get_tracked']);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Create price alert (POST)
app.post('/api/alerts', async (req, res) => {
  const { product_id, target_price } = req.body || {};
  if (!product_id || target_price === undefined) {
    return res.status(400).json({ error: 'product_id and target_price are required' });
  }
  try {
    const data = await runPythonBridge(['create_alert', String(product_id), String(target_price)]);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete price alert (DELETE)
app.delete('/api/alerts/:id', async (req, res) => {
  try {
    const data = await runPythonBridge(['delete_alert', req.params.id]);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Get price alerts (GET)
app.get('/api/alerts', async (_req, res) => {
  try {
    const data = await runPythonBridge(['get_alerts']);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PriceWise Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
