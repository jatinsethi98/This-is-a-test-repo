'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { Game, GameError } = require('../src/game');

function setup(names = ['Ann', 'Ben', 'Cat', 'Dan', 'Eve', 'Fay']) {
  let clock = 1_000_000;
  const game = new Game(null, { now: () => clock });
  const p = {};
  for (const n of names) p[n] = game.join(n);
  return { game, p, advance: (ms) => (clock += ms) };
}

// Make the first `traitors` names Traitors and start the game.
function started(names, traitors = ['Ann']) {
  const ctx = setup(names);
  for (const [n, info] of Object.entries(ctx.p)) {
    ctx.game.setRole({ playerId: info.playerId, role: traitors.includes(n) ? 'traitor' : 'faithful' });
  }
  ctx.game.startGame();
  return ctx;
}

const id = (ctx, n) => ctx.p[n].playerId;
const tok = (ctx, n) => ctx.p[n].token;

test('join validates names and rejects duplicates case-insensitively', () => {
  const { game } = setup(['Ann']);
  assert.throws(() => game.join('  '), /enter a name/);
  assert.throws(() => game.join('ann'), /already taken/);
  assert.throws(() => game.join('x'.repeat(25)), /at most 24/);
  assert.throws(() => game.join(42), /enter a name/);
  const r = game.join('  Big   Ben  ');
  assert.equal(r.name, 'Big Ben');
});

test('a failed action leaves state untouched (transactional)', () => {
  const { game } = setup();
  const before = JSON.stringify(game.state);
  assert.throws(() => game.startGame(), /at least one Traitor/);
  assert.equal(JSON.stringify(game.state), before);
});

test('random role assignment produces the exact number of Traitors', () => {
  const { game } = setup();
  for (let i = 0; i < 20; i++) {
    game.assignRolesRandom({ count: 2 });
    assert.equal(game.state.players.filter((p) => p.role === 'traitor').length, 2);
    assert.equal(game.state.players.filter((p) => p.role === 'faithful').length, 4);
  }
  assert.throws(() => game.assignRolesRandom({ count: 6 }), /at most 5/);
  assert.throws(() => game.assignRolesRandom({ count: 0 }), /at least one/);
});

test('roles are hidden from other players, and only visible to self after start', () => {
  const ctx = setup();
  ctx.game.assignRolesRandom({ count: 2 });
  const lobbyView = ctx.game.playerView(tok(ctx, 'Ann'));
  assert.equal(lobbyView.me.role, null, 'role hidden in lobby');
  ctx.game.startGame();
  for (const n of Object.keys(ctx.p)) {
    const v = ctx.game.playerView(tok(ctx, n));
    assert.ok(['traitor', 'faithful'].includes(v.me.role));
    for (const other of v.players) assert.equal(other.role, null, `${n} must not see roles`);
    const json = JSON.stringify(v);
    for (const other of Object.keys(ctx.p)) if (other !== n) assert.ok(!json.includes(tok(ctx, other)), 'no token leaks');
  }
  const screen = JSON.stringify(ctx.game.screenView());
  assert.ok(!screen.includes('traitor'), 'screen view must not leak roles');
});

test('traitors see each other only when the setting allows', () => {
  const ctx = started(undefined, ['Ann', 'Ben']);
  assert.deepEqual(ctx.game.playerView(tok(ctx, 'Ann')).fellowTraitors.map((f) => f.name), ['Ben']);
  assert.deepEqual(ctx.game.playerView(tok(ctx, 'Cat')).fellowTraitors, []);
  ctx.game.updateSettings({ traitorsKnowEachOther: false });
  assert.deepEqual(ctx.game.playerView(tok(ctx, 'Ann')).fellowTraitors, []);
});

test('banishment vote: tally, self-vote blocked, double vote blocked, ban + role reveal', () => {
  const ctx = started();
  const g = ctx.game;
  g.openVote();
  assert.throws(() => g.castVote(tok(ctx, 'Ann'), id(ctx, 'Ann')), /yourself/);
  g.castVote(tok(ctx, 'Ann'), id(ctx, 'Ben'));
  assert.throws(() => g.castVote(tok(ctx, 'Ann'), id(ctx, 'Cat')), /already voted/);
  for (const n of ['Ben', 'Cat', 'Dan', 'Eve']) g.castVote(tok(ctx, n), id(ctx, 'Ann'));
  g.castVote(tok(ctx, 'Fay'), id(ctx, 'Ben'));
  g.closeVote();
  assert.equal(g.state.phase, 'results');
  const res = g.state.vote.result;
  assert.deepEqual(res.leaders, [id(ctx, 'Ann')]);
  assert.equal(res.tie, false);
  assert.equal(res.tally[0].count, 4);
  g.banish({ playerId: id(ctx, 'Ann') });
  assert.equal(g.state.phase, 'day');
  assert.equal(g.state.lastEvent.role, 'traitor');
  const view = g.playerView(tok(ctx, 'Cat'));
  assert.equal(view.players.find((p) => p.name === 'Ann').role, 'traitor');
  assert.equal(view.players.find((p) => p.name === 'Ann').status, 'banished');
  // Banished players can't vote any more
  g.openVote();
  assert.throws(() => g.castVote(tok(ctx, 'Ann'), id(ctx, 'Ben')), /can't vote/);
  assert.ok(!g.state.vote.candidates.includes(id(ctx, 'Ann')));
});

test('role stays secret on banish when revealRoleOnBanish is off', () => {
  const ctx = started();
  const g = ctx.game;
  g.updateSettings({ revealRoleOnBanish: false });
  g.openVote();
  g.closeVote();
  g.banish({ playerId: id(ctx, 'Ann') });
  assert.equal(g.state.lastEvent.role, null);
  assert.equal(g.playerView(tok(ctx, 'Ben')).players.find((p) => p.name === 'Ann').role, null);
});

test('"who voted for me" is only shown after you vote, and only when enabled', () => {
  const ctx = started();
  const g = ctx.game;
  g.openVote();
  g.castVote(tok(ctx, 'Ben'), id(ctx, 'Ann'));
  g.castVote(tok(ctx, 'Cat'), id(ctx, 'Ann'));
  // Ann has not voted yet -> cannot see
  assert.equal(g.playerView(tok(ctx, 'Ann')).vote.votersForMe, null);
  g.castVote(tok(ctx, 'Ann'), id(ctx, 'Dan'));
  assert.deepEqual(g.playerView(tok(ctx, 'Ann')).vote.votersForMe.sort(), ['Ben', 'Cat']);
  // Nobody else gets Ann's info
  assert.deepEqual(g.playerView(tok(ctx, 'Ben')).vote.votersForMe, []);
  g.updateSettings({ showVotersToTarget: false });
  assert.equal(g.playerView(tok(ctx, 'Ann')).vote.votersForMe, null);
});

test('full results are revealed to players after close only when enabled', () => {
  const ctx = started();
  const g = ctx.game;
  g.openVote();
  g.castVote(tok(ctx, 'Ben'), id(ctx, 'Ann'));
  assert.equal(g.playerView(tok(ctx, 'Cat')).vote.results, null, 'never during voting');
  assert.equal(g.screenView().vote.results, null);
  g.updateSettings({ revealVotesAfterClose: false });
  g.closeVote();
  assert.equal(g.playerView(tok(ctx, 'Cat')).vote.results, null);
  assert.equal(g.screenView().vote.results, null);
  g.updateSettings({ revealVotesAfterClose: true });
  const r = g.playerView(tok(ctx, 'Cat')).vote.results;
  assert.deepEqual(r.ballots, [{ voterId: id(ctx, 'Ben'), voterName: 'Ben', choice: id(ctx, 'Ann'), targetName: 'Ann' }]);
  assert.ok(g.screenView().vote.results);
});

test('vote change only when allowed', () => {
  const ctx = started();
  const g = ctx.game;
  g.updateSettings({ allowVoteChange: true });
  g.openVote();
  g.castVote(tok(ctx, 'Ben'), id(ctx, 'Ann'));
  g.castVote(tok(ctx, 'Ben'), id(ctx, 'Cat'));
  assert.equal(g.state.vote.ballots[id(ctx, 'Ben')], id(ctx, 'Cat'));
});

test('tie triggers a re-vote limited to the tied players', () => {
  const ctx = started(['Ann', 'Ben', 'Cat', 'Dan']);
  const g = ctx.game;
  g.openVote();
  g.castVote(tok(ctx, 'Ann'), id(ctx, 'Ben'));
  g.castVote(tok(ctx, 'Ben'), id(ctx, 'Ann'));
  g.castVote(tok(ctx, 'Cat'), id(ctx, 'Ann'));
  g.castVote(tok(ctx, 'Dan'), id(ctx, 'Ben'));
  g.closeVote();
  assert.equal(g.state.vote.result.tie, true);
  g.revote();
  assert.equal(g.state.phase, 'voting');
  assert.deepEqual(g.state.vote.candidates.sort(), [id(ctx, 'Ann'), id(ctx, 'Ben')].sort());
  assert.throws(() => g.castVote(tok(ctx, 'Cat'), id(ctx, 'Dan')), /on the ballot/);
  g.castVote(tok(ctx, 'Cat'), id(ctx, 'Ann'));
  assert.equal(g.state.voteHistory.length, 1);
});

test('vote timer auto-closes the vote', () => {
  const ctx = started();
  const g = ctx.game;
  g.updateSettings({ voteTimerSeconds: 30 });
  g.openVote();
  assert.equal(g.tick(), false);
  ctx.advance(29_000);
  assert.equal(g.tick(), false);
  ctx.advance(1_000);
  assert.equal(g.tick(), true);
  assert.equal(g.state.phase, 'results');
});

test('auto-close when everyone has voted', () => {
  const ctx = started(['Ann', 'Ben', 'Cat']);
  const g = ctx.game;
  g.updateSettings({ autoCloseWhenAllVoted: true });
  g.openVote();
  g.castVote(tok(ctx, 'Ann'), id(ctx, 'Ben'));
  g.castVote(tok(ctx, 'Ben'), id(ctx, 'Ann'));
  assert.equal(g.state.phase, 'voting');
  g.castVote(tok(ctx, 'Cat'), id(ctx, 'Ann'));
  assert.equal(g.state.phase, 'results');
});

test('night murder, shields and breakfast reveal', () => {
  const ctx = started(undefined, ['Ann', 'Ben']);
  const g = ctx.game;
  g.setShield({ playerId: id(ctx, 'Cat'), value: true });
  g.startNight({ mode: 'murder' });
  // Faithful cannot vote at night, Traitors cannot target Traitors
  assert.throws(() => g.nightVote(tok(ctx, 'Cat'), id(ctx, 'Dan')), /Only living Traitors/);
  assert.throws(() => g.nightVote(tok(ctx, 'Ann'), id(ctx, 'Ben')), /living Faithful/);
  g.nightVote(tok(ctx, 'Ann'), id(ctx, 'Cat'));
  g.nightVote(tok(ctx, 'Ben'), id(ctx, 'Cat'));
  const tv = g.playerView(tok(ctx, 'Ann')).night;
  assert.equal(tv.ballots.length, 2);
  assert.equal(g.playerView(tok(ctx, 'Dan')).night, null, 'faithful see nothing at night');
  g.endNight({ murderId: id(ctx, 'Cat') });
  assert.equal(g.state.phase, 'breakfast');
  assert.equal(g.playerView(tok(ctx, 'Dan')).lastEvent, null, 'no spoilers before the reveal');
  g.revealBreakfast();
  assert.equal(g.state.lastEvent.type, 'shielded');
  assert.equal(g.state.players.find((p) => p.name === 'Cat').status, 'alive');
  assert.equal(g.state.players.find((p) => p.name === 'Cat').shield, false, 'shield used up');
  assert.equal(g.state.round, 2);

  g.startNight();
  g.endNight({ murderId: id(ctx, 'Dan') });
  g.revealBreakfast();
  assert.equal(g.state.lastEvent.type, 'murdered');
  assert.equal(g.state.players.find((p) => p.name === 'Dan').status, 'murdered');
  assert.equal(g.playerView(tok(ctx, 'Eve')).players.find((p) => p.name === 'Dan').role, 'faithful');
});

test('recruitment: accept turns a Faithful into a Traitor', () => {
  const ctx = started();
  const g = ctx.game;
  g.startNight({ mode: 'recruit' });
  g.sendRecruitOffer({ playerId: id(ctx, 'Cat') });
  assert.equal(g.playerView(tok(ctx, 'Cat')).recruitOffer.status, 'pending');
  assert.equal(g.playerView(tok(ctx, 'Dan')).recruitOffer, null);
  assert.throws(() => g.respondRecruit(tok(ctx, 'Dan'), true), /no recruitment offer/);
  g.respondRecruit(tok(ctx, 'Cat'), true);
  assert.equal(g.state.players.find((p) => p.name === 'Cat').role, 'traitor');
  assert.deepEqual(g.playerView(tok(ctx, 'Cat')).fellowTraitors.map((f) => f.name), ['Ann']);
  g.endNight();
  g.revealBreakfast();
  assert.equal(g.state.lastEvent.type, 'no-murder');
});

test('endgame vote: unanimous end finishes the game, otherwise continues', () => {
  const ctx = started(['Ann', 'Ben', 'Cat', 'Dan']);
  const g = ctx.game;
  g.openVote({ kind: 'endgame' });
  g.castVote(tok(ctx, 'Ann'), 'end');
  g.castVote(tok(ctx, 'Ben'), 'end');
  g.castVote(tok(ctx, 'Cat'), 'banish');
  g.castVote(tok(ctx, 'Dan'), 'end');
  g.closeVote();
  g.resolveEndgameVote();
  assert.equal(g.state.phase, 'day');
  g.openVote({ kind: 'endgame' });
  for (const n of ['Ann', 'Ben', 'Cat', 'Dan']) g.castVote(tok(ctx, n), 'end');
  g.closeVote();
  g.resolveEndgameVote();
  assert.equal(g.state.phase, 'ended');
  assert.equal(g.state.winner, 'traitors', 'Ann (Traitor) survived');
  for (const p of g.playerView(tok(ctx, 'Ben')).players) assert.ok(p.role, 'all roles revealed');
});

test('summary suggests a winner', () => {
  const ctx = started(['Ann', 'Ben', 'Cat']);
  const g = ctx.game;
  g.openVote();
  g.closeVote();
  g.banish({ playerId: id(ctx, 'Ann') });
  assert.match(g.summary().suggestion, /Faithful have won/);
  g.endGame();
  assert.equal(g.state.winner, 'faithful');
});

test('removing a player mid-vote cleans up their ballots', () => {
  const ctx = started();
  const g = ctx.game;
  g.openVote();
  g.castVote(tok(ctx, 'Ben'), id(ctx, 'Cat'));
  g.castVote(tok(ctx, 'Cat'), id(ctx, 'Ben'));
  g.removePlayer({ playerId: id(ctx, 'Cat') });
  assert.deepEqual(g.state.vote.ballots, {});
  g.closeVote();
  assert.ok(!g.state.vote.result.tally.some((t) => t.playerId === id(ctx, 'Cat')));
});

test('settings are validated', () => {
  const { game } = setup();
  assert.throws(() => game.updateSettings({ nope: true }), /Unknown setting/);
  assert.throws(() => game.updateSettings({ showVotersToTarget: 'yes' }), /true or false/);
  assert.throws(() => game.updateSettings({ voteTimerSeconds: -1 }), /between/);
  game.updateSettings({ voteTimerSeconds: 60, showVotersToTarget: false });
  assert.equal(game.state.settings.voteTimerSeconds, 60);
});

test('phase guards reject out-of-order actions', () => {
  const ctx = started();
  const g = ctx.game;
  assert.throws(() => g.closeVote(), GameError);
  assert.throws(() => g.banish({ playerId: id(ctx, 'Ann') }), /can't be done right now/);
  assert.throws(() => g.revealBreakfast(), GameError);
  assert.throws(() => g.castVote(tok(ctx, 'Ann'), id(ctx, 'Ben')), /not open/);
  assert.throws(() => g.startGame(), GameError);
});

test('reset keeps players (and their logins) but clears roles', () => {
  const ctx = started();
  const g = ctx.game;
  g.endGame();
  g.resetGame({ keepPlayers: true });
  assert.equal(g.state.phase, 'lobby');
  assert.equal(g.state.players.length, 6);
  assert.ok(g.state.players.every((p) => p.role === null && p.status === 'alive'));
  assert.equal(g.playerView(tok(ctx, 'Ann')).me.name, 'Ann');
  g.resetGame({ keepPlayers: false });
  assert.equal(g.state.players.length, 0);
});
