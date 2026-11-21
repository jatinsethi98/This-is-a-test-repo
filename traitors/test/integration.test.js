'use strict';

// Integration tests: start the real HTTP server on a random port with a temp
// data directory and play complete games through the API, exactly like the
// phones and admin page do.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { createApp } = require('../src/server');

const PASSWORD = 'test-password';
const quiet = { log() {}, warn() {}, error() {}, info() {} };

async function boot(dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'traitors-it-'))) {
  const app = createApp({ dataDir, adminPassword: PASSWORD, log: quiet, tickMs: 50 });
  const port = await app.start({ port: 0, host: '127.0.0.1' });
  const base = `http://127.0.0.1:${port}`;

  async function call(method, url, { body, token, admin, raw } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['X-Player-Token'] = token;
    if (admin) headers['X-Admin-Key'] = admin === true ? PASSWORD : admin;
    const res = await fetch(base + url, {
      method,
      headers,
      body: raw !== undefined ? raw : body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, data, headers: res.headers };
  }

  const client = {
    app,
    base,
    dataDir,
    call,
    async join(name) {
      const r = await call('POST', '/api/join', { body: { name } });
      assert.equal(r.status, 200, `join ${name}: ${JSON.stringify(r.data)}`);
      return r.data;
    },
    state: (token) => call('GET', '/api/player/state', { token }),
    vote: (token, choice) => call('POST', '/api/vote', { token, body: { choice } }),
    nightVote: (token, targetId) => call('POST', '/api/night-vote', { token, body: { targetId } }),
    admin: (action, params) => call('POST', '/api/admin/action', { admin: true, body: { action, params } }),
    async adminOk(action, params) {
      const r = await client.admin(action, params);
      assert.equal(r.status, 200, `${action}: ${JSON.stringify(r.data)}`);
      return r.data;
    },
    adminState: async () => (await call('GET', '/api/admin/state', { admin: true })).data,
    stop: () => app.stop(),
  };
  return client;
}

async function joinAll(c, names) {
  const players = {};
  for (const n of names) players[n] = await c.join(n);
  return players;
}

// Assign roles explicitly so tests are deterministic.
async function setRoles(c, players, traitors) {
  for (const [n, p] of Object.entries(players)) {
    await c.adminOk('setRole', { playerId: p.playerId, role: traitors.includes(n) ? 'traitor' : 'faithful' });
  }
}

test('pages and static assets are served', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  for (const url of ['/', '/admin', '/screen', '/style.css', '/common.js', '/player.js', '/admin.js', '/screen.js', '/vendor/qrcode.js']) {
    const r = await fetch(c.base + url);
    assert.equal(r.status, 200, url);
    await r.arrayBuffer();
  }
  const html = await (await fetch(c.base + '/')).text();
  assert.match(html, /Join the game/);
  assert.equal((await fetch(c.base + '/../package.json')).status, 404);
  assert.equal((await fetch(c.base + '/%2e%2e/package.json')).status, 404);
  assert.equal((await fetch(c.base + '/nope.html')).status, 404);
  const health = await c.call('GET', '/api/health');
  assert.equal(health.data.ok, true);
});

test('admin endpoints require the password', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  assert.equal((await c.call('GET', '/api/admin/state')).status, 401);
  assert.equal((await c.call('GET', '/api/admin/state', { admin: 'wrong' })).status, 401);
  assert.equal((await c.call('POST', '/api/admin/action', { admin: 'wrong', body: { action: 'startGame' } })).status, 401);
  assert.equal((await c.call('POST', '/api/admin/login', { body: { password: 'wrong' } })).status, 401);
  assert.equal((await c.call('POST', '/api/admin/login', { body: { password: PASSWORD } })).status, 200);
  assert.equal((await c.call('POST', '/api/admin/action', { admin: true, body: { action: 'constructor' } })).status, 400);
  assert.equal((await c.call('POST', '/api/admin/action', { admin: true, body: { action: 'playerView' } })).status, 400);
});

test('bad requests get clean errors and never crash the server', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  const cases = [
    await c.call('POST', '/api/join', { raw: '{not json' }),
    await c.call('POST', '/api/join', { raw: '[1,2,3]' }),
    await c.call('POST', '/api/join', { body: { name: '' } }),
    await c.call('POST', '/api/join', { body: { name: { evil: true } } }),
    await c.call('POST', '/api/vote', { body: { choice: 'x' } }),
    await c.call('POST', '/api/vote', { token: 'garbage', body: { choice: 'x' } }),
    await c.call('GET', '/api/player/state', { token: 'garbage' }),
    await c.call('POST', '/api/admin/action', { admin: true, body: { action: 'banish', params: null } }),
    await c.call('POST', '/api/admin/action', { admin: true, body: { action: 'banish', params: [1] } }),
    await c.call('POST', '/api/admin/action', { admin: true, body: { action: 'banish', params: { playerId: 'nope' } } }),
    await c.call('POST', '/api/admin/action', { admin: true, body: { action: 'updateSettings', params: { traitorCount: 'lots' } } }),
    await c.call('DELETE', '/api/join'),
    await c.call('POST', '/api/does-not-exist', { body: {} }),
  ];
  for (const r of cases) {
    assert.ok(r.status >= 400 && r.status < 500, `expected 4xx, got ${r.status} ${JSON.stringify(r.data)}`);
    assert.equal(typeof r.data.error, 'string');
  }
  const huge = await c.call('POST', '/api/join', { raw: JSON.stringify({ name: 'x'.repeat(100_000) }) });
  assert.equal(huge.status, 413);
  // Still alive and well
  assert.equal((await c.call('GET', '/api/health')).status, 200);
  await c.join('StillWorks');
});

test('names: duplicates rejected; rejoin code restores the same player', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  const ann = await c.join('Ann');
  const dup = await c.call('POST', '/api/join', { body: { name: 'ANN' } });
  assert.equal(dup.status, 409);
  const re = await c.call('POST', '/api/rejoin', { body: { code: ann.code.toLowerCase() } });
  assert.equal(re.status, 200);
  assert.equal(re.data.token, ann.token);
  assert.equal((await c.call('POST', '/api/rejoin', { body: { code: 'ZZZZZ' } })).status, 404);
  // XSS-y names are stored as plain text (the UI escapes them)
  const x = await c.join('<img src=x>');
  assert.equal(x.name, '<img src=x>');
});

test('joining closes when the game starts, admin can still add players', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  const players = await joinAll(c, ['Ann', 'Ben', 'Cat']);
  await setRoles(c, players, ['Ann']);
  await c.adminOk('startGame');
  const late = await c.call('POST', '/api/join', { body: { name: 'Late' } });
  assert.equal(late.status, 403);
  const added = await c.adminOk('addPlayer', { name: 'Late' });
  assert.ok(added.code);
  const s = await c.adminState();
  assert.equal(s.players.find((p) => p.name === 'Late').role, 'faithful');
});

test('FULL GAME: roles, round table, voter visibility, night, shield, recruit, endgame', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  const names = ['Ann', 'Ben', 'Cat', 'Dan', 'Eve', 'Fay', 'Gus', 'Hal'];
  const P = await joinAll(c, names);
  const tok = (n) => P[n].token;
  const pid = (n) => P[n].playerId;

  // --- Lobby: random assign works, then set deterministic roles
  await c.adminOk('assignRolesRandom', { count: 2 });
  let admin = await c.adminState();
  assert.equal(admin.players.filter((p) => p.role === 'traitor').length, 2);
  await setRoles(c, P, ['Ann', 'Ben']);
  // Before start, nobody sees roles
  assert.equal((await c.state(tok('Ann'))).data.me.role, null);

  await c.adminOk('startGame');

  // --- Roles are private
  for (const n of names) {
    const v = (await c.state(tok(n))).data;
    assert.equal(v.me.role, ['Ann', 'Ben'].includes(n) ? 'traitor' : 'faithful');
    assert.ok(v.players.every((p) => p.role === null), `${n} sees no roles`);
  }
  assert.deepEqual((await c.state(tok('Ann'))).data.fellowTraitors.map((f) => f.name), ['Ben']);
  assert.deepEqual((await c.state(tok('Cat'))).data.fellowTraitors, []);
  const screen = (await c.call('GET', '/api/screen')).data;
  assert.ok(screen.players.every((p) => p.role === null), 'TV screen shows no roles');
  assert.ok(!JSON.stringify(screen).includes(tok('Ann')), 'no tokens on screen');

  // --- Round 1 Round Table, with "see who voted for me" ON
  await c.adminOk('updateSettings', { showVotersToTarget: true, revealVotesAfterClose: true });
  await c.adminOk('openVote', { kind: 'banish' });

  // Self-vote and voting-for-nonexistent rejected
  assert.equal((await c.vote(tok('Cat'), pid('Cat'))).status, 400);
  assert.equal((await c.vote(tok('Cat'), 'nobody')).status, 400);

  // Everyone votes concurrently (simulates the whole room tapping at once)
  const plan = { Ann: 'Cat', Ben: 'Cat', Cat: 'Ann', Dan: 'Ann', Eve: 'Ann', Fay: 'Ann', Gus: 'Cat', Hal: 'Ben' };
  const before = (await c.state(tok('Ann'))).data.vote;
  assert.equal(before.votersForMe, null, "can't see voters before voting");
  const results = await Promise.all(Object.entries(plan).map(([v, target]) => c.vote(tok(v), pid(target))));
  for (const r of results) assert.equal(r.status, 200, JSON.stringify(r.data));
  // Double vote rejected (vote change off by default)
  assert.equal((await c.vote(tok('Hal'), pid('Cat'))).status, 409);

  let annView = (await c.state(tok('Ann'))).data;
  assert.deepEqual(annView.vote.votersForMe.sort(), ['Cat', 'Dan', 'Eve', 'Fay']);
  assert.equal(annView.vote.votedCount, 8);
  assert.equal(annView.vote.results, null, 'no full results while open');

  // Turn the setting OFF -> voters hidden
  await c.adminOk('updateSettings', { showVotersToTarget: false });
  annView = (await c.state(tok('Ann'))).data;
  assert.equal(annView.vote.votersForMe, null);
  await c.adminOk('updateSettings', { showVotersToTarget: true });

  // Admin sees everything live
  admin = await c.adminState();
  assert.equal(admin.vote.live.ballots.length, 8);
  assert.equal(admin.vote.live.leaders[0].name, 'Ann');

  await c.adminOk('closeVote');
  assert.equal((await c.vote(tok('Hal'), pid('Ann'))).status, 409, 'cannot vote after close');
  const catView = (await c.state(tok('Cat'))).data;
  assert.equal(catView.phase, 'results');
  assert.equal(catView.vote.results.tally[0].name, 'Ann');
  assert.equal(catView.vote.results.tally[0].count, 4);
  assert.equal(catView.vote.results.ballots.length, 8);

  await c.adminOk('banish', { playerId: pid('Ann') });
  const afterBanish = (await c.state(tok('Dan'))).data;
  assert.equal(afterBanish.lastEvent.type, 'banished');
  assert.equal(afterBanish.lastEvent.role, 'traitor');
  assert.equal(afterBanish.players.find((p) => p.name === 'Ann').role, 'traitor');

  // --- Night 1: murder blocked by shield
  await c.adminOk('setShield', { playerId: pid('Cat'), value: true });
  assert.equal((await c.state(tok('Cat'))).data.me.shield, true);
  assert.equal((await c.state(tok('Dan'))).data.me.shield, false);
  await c.adminOk('startNight', { mode: 'murder' });
  assert.equal((await c.nightVote(tok('Ann'), pid('Cat'))).status, 403, 'banished traitor cannot act');
  assert.equal((await c.nightVote(tok('Dan'), pid('Cat'))).status, 403, 'faithful cannot act');
  assert.equal((await c.nightVote(tok('Ben'), pid('Cat'))).status, 200);
  assert.equal((await c.state(tok('Dan'))).data.night, null);
  admin = await c.adminState();
  assert.equal(admin.night.ballots[0].targetName, 'Cat');
  await c.adminOk('endNight', { murderId: pid('Cat') });
  await c.adminOk('revealBreakfast');
  let dan = (await c.state(tok('Dan'))).data;
  assert.equal(dan.lastEvent.type, 'shielded');
  assert.equal(dan.players.find((p) => p.name === 'Cat').status, 'alive');
  assert.equal(dan.round, 2);

  // --- Round 2: tie -> revote among tied
  await c.adminOk('openVote');
  const plan2 = { Ben: 'Cat', Cat: 'Ben', Dan: 'Ben', Eve: 'Cat', Fay: 'Gus', Gus: 'Fay', Hal: 'Hal' };
  for (const [v, target] of Object.entries(plan2)) {
    if (v === target) continue; // Hal abstains
    assert.equal((await c.vote(tok(v), pid(target))).status, 200);
  }
  await c.adminOk('closeVote');
  admin = await c.adminState();
  assert.equal(admin.vote.live.tie, true);
  assert.deepEqual(admin.vote.live.leaders.map((l) => l.name).sort(), ['Ben', 'Cat']);
  assert.deepEqual(admin.vote.live.nonVoters.map((n) => n.name), ['Hal']);
  await c.adminOk('revote', { candidates: admin.vote.live.leaders.map((l) => l.id) });
  assert.equal((await c.vote(tok('Dan'), pid('Eve'))).status, 400, 'Eve not on revote ballot');
  for (const v of ['Cat', 'Dan', 'Eve', 'Fay', 'Gus', 'Hal']) assert.equal((await c.vote(tok(v), pid('Ben'))).status, 200);
  assert.equal((await c.vote(tok('Ben'), pid('Cat'))).status, 200);
  await c.adminOk('closeVote');
  await c.adminOk('banish', { playerId: pid('Ben') });
  admin = await c.adminState();
  assert.equal(admin.summary.aliveTraitors, 0);
  assert.match(admin.summary.suggestion, /Faithful have won/);

  // Admin fixes a mistake: revive Ben as if banishment was wrong, then re-banish.
  await c.adminOk('setStatus', { playerId: pid('Ben'), status: 'alive' });
  assert.equal((await c.adminState()).summary.aliveTraitors, 1);

  // --- Night 2: recruitment
  await c.adminOk('startNight', { mode: 'recruit' });
  await c.adminOk('sendRecruitOffer', { playerId: pid('Eve') });
  assert.equal((await c.state(tok('Eve'))).data.recruitOffer.status, 'pending');
  assert.equal((await c.state(tok('Fay'))).data.recruitOffer, null);
  const acc = await c.call('POST', '/api/recruit-response', { token: tok('Eve'), body: { accept: true } });
  assert.equal(acc.status, 200);
  const eve = (await c.state(tok('Eve'))).data;
  assert.equal(eve.me.role, 'traitor');
  assert.deepEqual(eve.fellowTraitors.map((f) => f.name).sort(), ['Ann', 'Ben']);
  await c.adminOk('setNightMode', { mode: 'murder' });
  assert.equal((await c.nightVote(tok('Eve'), pid('Dan'))).status, 200);
  await c.adminOk('endNight', { murderId: pid('Dan') });
  // Breakfast: nothing revealed yet
  dan = (await c.state(tok('Dan'))).data;
  assert.equal(dan.phase, 'breakfast');
  assert.equal(dan.me.status, 'alive');
  await c.adminOk('revealBreakfast');
  dan = (await c.state(tok('Dan'))).data;
  assert.equal(dan.me.status, 'murdered');
  assert.equal(dan.lastEvent.type, 'murdered');

  // Murdered players can't vote
  await c.adminOk('openVote');
  assert.equal((await c.vote(tok('Dan'), pid('Eve'))).status, 403);
  await c.adminOk('cancelVote');

  // --- Endgame vote: not unanimous, then unanimous
  await c.adminOk('openVote', { kind: 'endgame' });
  const alive = ['Ben', 'Cat', 'Eve', 'Fay', 'Gus', 'Hal'];
  for (const n of alive) assert.equal((await c.vote(tok(n), n === 'Cat' ? 'banish' : 'end')).status, 200);
  await c.adminOk('closeVote');
  await c.adminOk('resolveEndgameVote');
  assert.equal((await c.adminState()).phase, 'day');
  await c.adminOk('openVote', { kind: 'endgame' });
  for (const n of alive) assert.equal((await c.vote(tok(n), 'end')).status, 200);
  await c.adminOk('closeVote');
  await c.adminOk('resolveEndgameVote');

  const final = (await c.state(tok('Hal'))).data;
  assert.equal(final.phase, 'ended');
  assert.equal(final.winner, 'traitors');
  assert.ok(final.players.every((p) => p.role), 'all roles revealed at the end');
  const finalScreen = (await c.call('GET', '/api/screen')).data;
  assert.equal(finalScreen.winner, 'traitors');

  // --- New game with the same players: everyone stays logged in
  await c.adminOk('resetGame', { keepPlayers: true });
  const fresh = (await c.state(tok('Hal'))).data;
  assert.equal(fresh.phase, 'lobby');
  assert.equal(fresh.me.role, null);
  assert.equal(fresh.players.length, 8);
});

test('reveal-after-close OFF keeps the tally secret from players and screen', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  const P = await joinAll(c, ['Ann', 'Ben', 'Cat']);
  await setRoles(c, P, ['Ann']);
  await c.adminOk('startGame');
  await c.adminOk('updateSettings', { revealVotesAfterClose: false, showVotersToTarget: false });
  await c.adminOk('openVote');
  await c.vote(P.Ann.token, P.Ben.playerId);
  await c.vote(P.Ben.token, P.Ann.playerId);
  await c.adminOk('closeVote');
  const v = (await c.state(P.Cat.token)).data.vote;
  assert.equal(v.results, null);
  assert.equal(v.votersForMe, null);
  assert.equal((await c.call('GET', '/api/screen')).data.vote.results, null);
  assert.equal((await c.adminState()).vote.live.ballots.length, 2, 'admin still sees it');
});

test('vote timer closes voting on the server even if nobody polls', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  const P = await joinAll(c, ['Ann', 'Ben', 'Cat']);
  await setRoles(c, P, ['Ann']);
  await c.adminOk('startGame');
  await c.adminOk('updateSettings', { voteTimerSeconds: 1 });
  await c.adminOk('openVote');
  await c.vote(P.Ann.token, P.Ben.playerId);
  await new Promise((r) => setTimeout(r, 1400));
  const s = await c.adminState();
  assert.equal(s.phase, 'results');
  assert.equal(s.vote.live.ballots.length, 1);
});

test('state survives a server restart (laptop crash / Ctrl+C)', async () => {
  const c1 = await boot();
  const P = await joinAll(c1, ['Ann', 'Ben', 'Cat', 'Dan']);
  await setRoles(c1, P, ['Ann']);
  await c1.adminOk('startGame');
  await c1.adminOk('openVote');
  await c1.vote(P.Ben.token, P.Ann.playerId);
  await c1.vote(P.Cat.token, P.Ann.playerId);
  await c1.stop();

  const c2 = await boot(c1.dataDir);
  try {
    const v = (await c2.state(P.Ben.token)).data;
    assert.equal(v.me.name, 'Ben', 'same token still works');
    assert.equal(v.phase, 'voting');
    assert.equal(v.vote.myBallotName, 'Ann');
    assert.equal(v.vote.votedCount, 2);
    // Keep playing after restart
    assert.equal((await c2.vote(P.Dan.token, P.Ann.playerId)).status, 200);
    await c2.adminOk('closeVote');
    await c2.adminOk('banish', { playerId: P.Ann.playerId });
    assert.equal((await c2.adminState()).summary.aliveTraitors, 0);
  } finally {
    await c2.stop();
  }
});

test('corrupt save file falls back to the backup copy', async () => {
  const c1 = await boot();
  await joinAll(c1, ['Ann', 'Ben']);
  await c1.join('Cat'); // second save -> backup holds the 2-player state
  await c1.stop();
  fs.writeFileSync(path.join(c1.dataDir, 'state.json'), '{ this is broken');
  const c2 = await boot(c1.dataDir);
  try {
    const s = await c2.adminState();
    assert.ok(s.players.length >= 2, 'restored from backup');
    assert.ok(s.players.some((p) => p.name === 'Ann'));
  } finally {
    await c2.stop();
  }
});

test('admin password is generated once and remembered', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'traitors-pw-'));
  const a1 = createApp({ dataDir, log: quiet });
  const pw = a1.adminPassword;
  assert.match(pw, /^[a-z]+-\d{4}$/);
  await a1.stop();
  const a2 = createApp({ dataDir, log: quiet });
  assert.equal(a2.adminPassword, pw);
  await a2.stop();
});

test('load: 40 players polling and voting at once', async (t) => {
  const c = await boot();
  t.after(() => c.stop());
  const names = Array.from({ length: 40 }, (_, i) => `Player ${i + 1}`);
  const joined = await Promise.all(names.map((n) => c.call('POST', '/api/join', { body: { name: n } })));
  for (const r of joined) assert.equal(r.status, 200);
  const P = joined.map((r) => r.data);
  await c.adminOk('assignRolesRandom', { count: 8 });
  await c.adminOk('startGame');
  await c.adminOk('openVote');
  const target = P[0].playerId;
  const ops = [];
  for (const p of P) {
    ops.push(c.vote(p.token, p.playerId === target ? P[1].playerId : target));
    for (let i = 0; i < 5; i++) ops.push(c.state(p.token));
    ops.push(c.call('GET', '/api/screen'));
  }
  const all = await Promise.all(ops);
  for (const r of all) assert.equal(r.status, 200);
  const s = await c.adminState();
  assert.equal(s.vote.votedCount, 40);
  assert.equal(s.vote.live.leaders[0].id, target);
});

test('port fallback: a busy port moves on to the next one', async (t) => {
  const blocker = http.createServer();
  await new Promise((r) => blocker.listen(0, '127.0.0.1', r));
  const busy = blocker.address().port;
  t.after(() => blocker.close());
  const app = createApp({ dataDir: fs.mkdtempSync(path.join(os.tmpdir(), 'traitors-port-')), adminPassword: 'x', log: quiet });
  t.after(() => app.stop());
  const port = await app.start({ port: busy, host: '127.0.0.1', tryNextPorts: 5 });
  assert.notEqual(port, busy);
});
