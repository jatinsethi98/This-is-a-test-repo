#!/usr/bin/env node
'use strict';

const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error(`This app needs Node.js 18 or newer (you have ${process.versions.node}). Get it from https://nodejs.org`);
  process.exit(1);
}

const path = require('path');
const { createApp } = require('./src/server');

const args = process.argv.slice(2);
function arg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

const explicitPort = arg('port') || process.env.PORT;
const port = Number(explicitPort || 3000);
const dataDir = path.resolve(arg('data') || process.env.TRAITORS_DATA_DIR || path.join(__dirname, 'data'));
const adminPassword = arg('password') || process.env.TRAITORS_ADMIN_PASSWORD;
const publicUrl = arg('public-url') || process.env.TRAITORS_PUBLIC_URL;

// Keep the game alive no matter what: log unexpected errors instead of exiting.
process.on('uncaughtException', (err) => console.error('[uncaught]', err));
process.on('unhandledRejection', (err) => console.error('[unhandled]', err));

const app = createApp({ dataDir, adminPassword, publicUrl });

app
  .start({ port, tryNextPorts: explicitPort ? 0 : 10 })
  .then((actualPort) => {
    const urls = app.joinUrls();
    const main = urls[0] || `http://localhost:${actualPort}/`;
    const line = '='.repeat(64);
    console.log(`\n${line}\n  THE TRAITORS — game server is running\n${line}`);
    console.log(`\n  Players join at:   ${main}`);
    if (!publicUrl) console.log('                     (or your tunnel link, e.g. https://xxxx.trycloudflare.com)');
    for (const u of urls.slice(1)) console.log(`                     ${u}   (other network)`);
    console.log(`  Host / admin:      ${main}admin`);
    console.log(`  TV / big screen:   ${main}screen`);
    console.log(`\n  Admin password:    ${app.adminPassword}`);
    console.log(`  Game data saved in ${dataDir}`);
    console.log('\n  Keep this window open during the game. Press Ctrl+C to stop.');
    console.log(`${line}\n`);
  })
  .catch((err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Start with a different one, e.g.  npm start -- --port 4000`);
    } else {
      console.error('Could not start the server:', err);
    }
    process.exit(1);
  });

function shutdown() {
  console.log('\nSaving and shutting down...');
  app.store.save(app.game.state);
  app.stop().then(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
