// Servidor estático mínimo para previsualizar la web (sin dependencias)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404); return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500); res.end('Server error');
  }
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}`));
