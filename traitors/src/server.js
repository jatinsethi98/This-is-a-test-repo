'use strict';

// HTTP server: static pages + JSON API. Uses only Node's standard library so
// there is nothing to install and nothing that can break at a party.

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { Game, GameError, ADMIN_ACTIONS } = require('./game');
const { Store } = require('./store');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MAX_BODY = 32 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

const PAGES = { '/': 'index.html', '/admin': 'admin.html', '/host': 'admin.html', '/screen': 'screen.html', '/tv': 'screen.html' };

function lanAddresses() {
  const out = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const addr of list || []) {
      if ((addr.family === 'IPv4' || addr.family === 4) && !addr.internal) out.push(addr.address);
    }
  }
  // Prefer typical home-network ranges first.
  return out.sort((a, b) => score(b) - score(a));
  function score(ip) {
    if (ip.startsWith('192.168.')) return 3;
    if (ip.startsWith('10.')) return 2;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return 1;
    return 0;
  }
}

function generatePassword() {
  const words = ['raven', 'cloak', 'dagger', 'castle', 'turret', 'shadow', 'goblet', 'banner', 'lantern', 'velvet'];
  return `${words[crypto.randomInt(words.length)]}-${crypto.randomInt(1000, 10000)}`;
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function createApp(options = {}) {
  const log = options.log || console;
  const dataDir = options.dataDir || path.join(__dirname, '..', 'data');
  const store = new Store(dataDir, { log });
  const now = options.now || (() => Date.now());

  let adminPassword = options.adminPassword || process.env.TRAITORS_ADMIN_PASSWORD || store.readAdminPassword();
  if (!adminPassword) {
    adminPassword = generatePassword();
    store.writeAdminPassword(adminPassword);
  }

  const game = new Game(store.load(), { now });
  let port = null;

  function persist() {
    store.save(game.state);
  }

  // Close timed votes even if nobody is polling.
  const ticker = setInterval(() => {
    try {
      if (game.tick()) persist();
    } catch (err) {
      log.error('[tick]', err);
    }
  }, options.tickMs || 500);
  ticker.unref();

  function send(res, status, body, headers = {}) {
    const data = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    });
    res.end(data);
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0;
      const chunks = [];
      req.on('data', (chunk) => {
        size += chunk.length;
        if (size > MAX_BODY) {
          reject(new GameError('Request too large.', 413));
          req.resume();
          return;
        }
        chunks.push(chunk);
      });
      req.on('end', () => {
        if (size > MAX_BODY) return;
        const raw = Buffer.concat(chunks).toString('utf8');
        if (!raw.trim()) return resolve({});
        try {
          const parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
          resolve(parsed);
        } catch {
          reject(new GameError('Invalid JSON body.', 400));
        }
      });
      req.on('error', reject);
    });
  }

  function joinUrls() {
    return lanAddresses().map((ip) => `http://${ip}:${port}/`);
  }

  function isAdmin(req) {
    const key = req.headers['x-admin-key'];
    return typeof key === 'string' && key.length > 0 && safeEqual(key, adminPassword);
  }

  function serveStatic(req, res, pathname) {
    const file = PAGES[pathname] || pathname.replace(/^\/+/, '');
    const resolved = path.resolve(PUBLIC_DIR, file);
    if (!resolved.startsWith(PUBLIC_DIR + path.sep)) return send(res, 404, { error: 'Not found' });
    fs.readFile(resolved, (err, data) => {
      if (err) return send(res, 404, { error: 'Not found' });
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(resolved)] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(data);
    });
  }

  async function api(req, res, pathname) {
    const method = req.method;
    const token = req.headers['x-player-token'];

    if (method === 'GET' && pathname === '/api/health') return send(res, 200, { ok: true, rev: game.state.rev });

    if (method === 'GET' && pathname === '/api/player/state') {
      return send(res, 200, { ...game.playerView(token), serverNow: now() });
    }
    if (method === 'GET' && pathname === '/api/screen') {
      return send(res, 200, { ...game.screenView(), joinUrls: joinUrls(), serverNow: now() });
    }
    if (method === 'GET' && pathname === '/api/admin/state') {
      if (!isAdmin(req)) throw new GameError('Wrong admin password.', 401);
      return send(res, 200, { ...game.adminView(), joinUrls: joinUrls(), serverNow: now() });
    }

    if (method !== 'POST') throw new GameError('Not found.', 404);
    const body = await readBody(req);

    let result;
    switch (pathname) {
      case '/api/join':
        result = game.join(body.name);
        break;
      case '/api/rejoin':
        result = game.rejoin(body.code);
        break;
      case '/api/vote':
        result = game.castVote(token, body.choice);
        break;
      case '/api/night-vote':
        result = game.nightVote(token, body.targetId);
        break;
      case '/api/recruit-response':
        result = game.respondRecruit(token, body.accept);
        break;
      case '/api/admin/login':
        if (typeof body.password !== 'string' || !safeEqual(body.password, adminPassword)) {
          throw new GameError('Wrong admin password.', 401);
        }
        return send(res, 200, { ok: true });
      case '/api/admin/action': {
        if (!isAdmin(req)) throw new GameError('Wrong admin password.', 401);
        const { action, params } = body;
        if (typeof action !== 'string' || !ADMIN_ACTIONS.includes(action)) {
          throw new GameError(`Unknown action: ${String(action)}`, 400);
        }
        if (params !== undefined && (params === null || typeof params !== 'object' || Array.isArray(params))) {
          throw new GameError('params must be an object.', 400);
        }
        result = game[action](params || {});
        break;
      }
      default:
        throw new GameError('Not found.', 404);
    }
    persist();
    return send(res, 200, { ok: true, rev: game.state.rev, ...(result && typeof result === 'object' ? result : {}) });
  }

  async function handle(req, res) {
    let pathname = '/';
    try {
      pathname = new URL(req.url, 'http://local').pathname;
    } catch {
      return send(res, 400, { error: 'Bad URL' });
    }
    try {
      if (pathname.startsWith('/api/')) return await api(req, res, pathname);
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed' });
      return serveStatic(req, res, pathname);
    } catch (err) {
      if (err instanceof GameError) return send(res, err.status, { error: err.message });
      log.error('[server] unexpected error', err);
      if (!res.headersSent) send(res, 500, { error: 'Something went wrong on the host laptop. Please try again.' });
    }
  }

  const server = http.createServer((req, res) => {
    handle(req, res).catch((err) => {
      log.error('[server] fatal handler error', err);
      try {
        if (!res.headersSent) send(res, 500, { error: 'Server error' });
      } catch {
        /* ignore */
      }
    });
  });
  server.keepAliveTimeout = 5000;
  server.on('clientError', (err, socket) => {
    try {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    } catch {
      /* ignore */
    }
  });

  function listen(wantedPort, host) {
    return new Promise((resolve, reject) => {
      const onError = (err) => {
        server.removeListener('listening', onListening);
        reject(err);
      };
      const onListening = () => {
        server.removeListener('error', onError);
        resolve(server.address().port);
      };
      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(wantedPort, host);
    });
  }

  async function start({ port: wantedPort = 3000, host = '0.0.0.0', tryNextPorts = 0 } = {}) {
    let p = wantedPort;
    for (let attempt = 0; ; attempt++) {
      try {
        port = await listen(p, host);
        return port;
      } catch (err) {
        if (err.code === 'EADDRINUSE' && attempt < tryNextPorts && p !== 0) {
          log.warn(`[server] port ${p} is busy, trying ${p + 1}...`);
          p += 1;
          continue;
        }
        throw err;
      }
    }
  }

  function stop() {
    clearInterval(ticker);
    return new Promise((resolve) => {
      server.close(() => resolve());
      if (server.closeAllConnections) server.closeAllConnections();
    });
  }

  return {
    server,
    game,
    store,
    start,
    stop,
    get adminPassword() {
      return adminPassword;
    },
    get port() {
      return port;
    },
    joinUrls,
  };
}

module.exports = { createApp, lanAddresses };
