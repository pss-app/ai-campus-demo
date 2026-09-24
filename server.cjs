const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Serve only the site's public files, never a directory listing.
const publicFiles = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/learning.html', ['learning.html', 'text/html']],
  ['/style.css', ['style.css', 'text/css']],
  ['/landing.css', ['landing.css', 'text/css']],
  ['/app.js', ['app.js', 'text/javascript']],
]);
const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }
  let pathname;
  try { pathname = new URL(req.url, 'http://localhost').pathname; }
  catch { res.writeHead(400); return res.end('Bad request'); }
  const entry = publicFiles.get(pathname);
  if (!entry) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('ページが見つかりません。');
  }
  fs.readFile(path.join(__dirname, entry[0]), (error, data) => {
    if (error) { res.writeHead(500); return res.end('Unable to load page'); }
    res.writeHead(200, {
      'Content-Type': `${entry[1]}; charset=utf-8`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});
server.on('error', error => {
  console.error(`サーバーを起動できません: ${error.message}`);
  process.exitCode = 1;
});
server.listen(4173, '127.0.0.1', () => {
  console.log('AI CAMPUS: http://127.0.0.1:4173/');
  console.log('終了するには Ctrl+C を押してください。');
});
