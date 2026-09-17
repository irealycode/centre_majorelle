#!/usr/bin/env node
/**
 * Minimal static server for previewing dist/ locally. No dependencies.
 *
 *   node tools/serve.mjs [port]
 *
 * Serves dist/ with the same URL shapes the host will use: `/` and `/ar/`
 * resolve to index.html, and an unknown path renders 404.html with a real
 * 404 status.
 */

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2]) || 4321;

// Serve under a sub-path, the way a GitHub project site does
// (nom.github.io/nom-du-depot/). Must match the BASE_PATH the site was built with.
const BASE = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

async function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) return null;
  try {
    const s = await stat(file);
    if (s.isDirectory()) return resolve(p + '/');
    return file;
  } catch {
    return null;
  }
}

const server = http
  .createServer(async (req, res) => {
    // Outside the base path there is nothing — exactly like the real host.
    if (BASE && req.url !== BASE && !req.url.startsWith(BASE + '/')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end(`Not under ${BASE}/`);
      return;
    }
    if (BASE && req.url === BASE) {
      res.writeHead(301, { Location: BASE + '/' }).end();
      return;
    }
    const local = BASE ? req.url.slice(BASE.length) : req.url;

    let file = await resolve(local);
    let status = 200;

    if (!file) {
      status = 404;
      const ar = local.startsWith('/ar/');
      file = path.join(ROOT, ar ? 'ar' : '', '404.html');
    }

    try {
      let body = await readFile(file);
      const type = TYPES[path.extname(file)] || 'application/octet-stream';
      const headers = { 'Content-Type': type, 'Cache-Control': 'no-store' };

      // Compress text the way any real host does. Without this, local
      // performance measurements are pessimistic by a wide margin — the HTML
      // alone is ~42 KB raw against ~8 KB gzipped.
      const compressible = /^(text\/|application\/(json|xml|manifest))/.test(type) ||
        type.includes('javascript');
      if (compressible && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
        body = gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
        headers.Vary = 'Accept-Encoding';
      }

      res.writeHead(status, headers);
      res.end(body);
    } catch {
      res.writeHead(500).end('500');
    }
  });

// If the port is taken — usually a preview still running from earlier — step
// to the next one rather than dying with a stack trace.
let port = PORT;
server.on('error', (err) => {
  if (err.code !== 'EADDRINUSE') throw err;
  if (port - PORT >= 10) {
    console.error(`Ports ${PORT}-${port} are all in use. Pass one explicitly: node tools/serve.mjs 8080`);
    process.exit(1);
  }
  console.log(`  port ${port} in use, trying ${port + 1}`);
  server.listen(++port);
});

server.listen(port, () => console.log(`\n  http://localhost:${port}${BASE}/\n`));
