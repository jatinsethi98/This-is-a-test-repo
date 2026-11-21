'use strict';

// Pure game logic for The Traitors. No I/O happens here: the server owns
// persistence and HTTP. Every mutating action runs inside a transaction, so
// an action that throws leaves the state exactly as it was before.

const crypto = require('crypto');

class GameError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'GameError';
    this.status = status;
  }
}

const ROLES = ['faithful', 'traitor'];
const STATUSES = ['alive', 'banished', 'murdered'];
const NIGHT_MODES = ['murder', 'recruit'];
const MAX_PLAYERS = 60;
const MAX_NAME = 24;
const MAX_EVENTS = 200;

const DEFAULT_SETTINGS = Object.freeze({
  // After a player submits their vote they can see who has voted for them.
  showVotersToTarget: true,
  // Once voting closes, every player sees the full breakdown (who voted for whom).
  revealVotesAfterClose: true,
  // A banished player's role (Traitor / Faithful) is announced to everyone.
  revealRoleOnBanish: true,
  // Players may change their vote until voting closes.
  allowVoteChange: false,
  // Traitors can see who the other Traitors are.
  traitorsKnowEachOther: true,
  // Close the vote automatically as soon as every eligible player has voted.
  autoCloseWhenAllVoted: false,
  // Countdown for each vote in seconds (0 = no timer, host closes manually).
  voteTimerSeconds: 0,
  // Default number of Traitors for random role assignment.
  traitorCount: 2,
  // Whether new players may join.
  joinOpen: true,
});

const SETTING_RULES = {
  showVotersToTarget: 'boolean',
  revealVotesAfterClose: 'boolean',
  revealRoleOnBanish: 'boolean',
  allowVoteChange: 'boolean',
  traitorsKnowEachOther: 'boolean',
  autoCloseWhenAllVoted: 'boolean',
  joinOpen: 'boolean',
  voteTimerSeconds: [0, 3600],
  traitorCount: [1, 20],
};

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomId(bytes = 8) {
  return crypto.randomBytes(bytes).toString('hex');
}

function freshState(settings) {
  return {
    rev: 0,
    phase: 'lobby',
    round: 0,
    settings: { ...DEFAULT_SETTINGS, ...(settings || {}) },
    players: [],
    vote: null,
    voteHistory: [],
    night: null,
    recruitOffer: null,
    breakfast: null,
    lastEvent: null,
    announcement: null,
    events: [],
    winner: null,
  };
}

// Bring a loaded state up to date with the current shape (forward compatible).
function migrate(state) {
  const base = freshState();
  const out = { ...base, ...state };
  out.settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
  for (const key of ['players', 'voteHistory', 'events']) {
    if (!Array.isArray(out[key])) out[key] = [];
  }
  if (typeof out.rev !== 'number') out.rev = 0;
  return out;
}

function normalizeName(raw) {
  if (typeof raw !== 'string') throw new GameError('Please enter a name.');
  // Strip control characters and collapse whitespace.
  const name = raw.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim();
  if (!name) throw new GameError('Please enter a name.');
  if (name.length > MAX_NAME) throw new GameError(`Names can be at most ${MAX_NAME} characters.`);
  return name;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class Game {
  constructor(state, { now = () => Date.now() } = {}) {
    this.state = state ? migrate(state) : freshState();
    this.now = now;
  }

  // ---------------------------------------------------------------- helpers

  transact(fn) {
    const backup = structuredClone(this.state);
    try {
      const result = fn();
      this.state.rev += 1;
      return result;
    } catch (err) {
      this.state = backup;
      throw err;
    }
  }

  get s() {
    return this.state;
  }

  player(id) {
    const p = this.s.players.find((x) => x.id === id);
    if (!p) throw new GameError('Player not found.', 404);
    return p;
  }

  playerByToken(token) {
    if (typeof token !== 'string' || !token) return null;
    return this.s.players.find((x) => x.token === token) || null;
  }

  requirePlayer(token) {
    const p = this.playerByToken(token);
    if (!p) throw new GameError('You are not in this game. Please join again.', 401);
    return p;
  }

  alive() {
    return this.s.players.filter((p) => p.status === 'alive');
  }

  name(id) {
    const p = this.s.players.find((x) => x.id === id);
    return p ? p.name : '(removed)';
  }

  requirePhase(...phases) {
    if (!phases.includes(this.s.phase)) {
      throw new GameError(`That can't be done right now (current phase: ${this.s.phase}).`, 409);
    }
  }

  addEvent(text, extra = {}) {
    this.s.events.push({ at: this.now(), round: this.s.round, text, ...extra });
    if (this.s.events.length > MAX_EVENTS) this.s.events.splice(0, this.s.events.length - MAX_EVENTS);
  }

  newCode() {
    const used = new Set(this.s.players.map((p) => p.code));
    for (;;) {
      let code = '';
      for (let i = 0; i < 5; i++) code += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
      if (!used.has(code)) return code;
    }
  }

  started() {
    return this.s.phase !== 'lobby';
  }

  summary() {
    const alive = this.alive();
    const aliveTraitors = alive.filter((p) => p.role === 'traitor').length;
    const aliveFaithful = alive.length - aliveTraitors;
    let suggestion = null;
    if (this.started() && this.s.phase !== 'ended') {
      if (aliveTraitors === 0) suggestion = 'No Traitors remain — the Faithful have won. End the game to reveal everyone.';
      else if (aliveTraitors >= aliveFaithful) suggestion = 'Traitors now equal or outnumber the Faithful — the Traitors have won.';
      else if (alive.length <= 4) suggestion = 'Only a few players remain — consider the Endgame vote ("end the game" or "banish again").';
    }
    return { alive: alive.length, aliveTraitors, aliveFaithful, total: this.s.players.length, suggestion };
  }

  // ---------------------------------------------------------------- joining

  createPlayer(rawName) {
    const name = normalizeName(rawName);
    if (this.s.players.length >= MAX_PLAYERS) throw new GameError('The game is full.', 409);
    const lower = name.toLowerCase();
    if (this.s.players.some((p) => p.name.toLowerCase() === lower)) {
      throw new GameError(`The name "${name}" is already taken. If that's you, use your rejoin code (the host can see it).`, 409);
    }
    const p = {
      id: randomId(6),
      name,
      token: randomId(16),
      code: this.newCode(),
      role: this.started() ? 'faithful' : null,
      status: 'alive',
      shield: false,
      roleRevealed: this.s.phase === 'ended',
      joinedAt: this.now(),
    };
    this.s.players.push(p);
    return p;
  }

  join(rawName) {
    return this.transact(() => {
      if (!this.s.settings.joinOpen) throw new GameError('Joining is closed. Ask the host to let you in.', 403);
      const p = this.createPlayer(rawName);
      if (this.started()) this.addEvent(`${p.name} joined the game.`);
      return { token: p.token, playerId: p.id, code: p.code, name: p.name };
    });
  }

  rejoin(rawCode) {
    if (typeof rawCode !== 'string') throw new GameError('Please enter your rejoin code.');
    const code = rawCode.trim().toUpperCase();
    const p = this.s.players.find((x) => x.code === code);
    if (!p) throw new GameError('That rejoin code was not recognised.', 404);
    return { token: p.token, playerId: p.id, code: p.code, name: p.name };
  }

  // ---------------------------------------------------------------- admin: players

  addPlayer({ name }) {
    return this.transact(() => {
      const p = this.createPlayer(name);
      if (this.started()) this.addEvent(`${p.name} joined the game.`);
      return { playerId: p.id, code: p.code, name: p.name };
    });
  }

  renamePlayer({ playerId, name }) {
    return this.transact(() => {
      const p = this.player(playerId);
      const n = normalizeName(name);
      if (this.s.players.some((x) => x.id !== p.id && x.name.toLowerCase() === n.toLowerCase())) {
        throw new GameError(`The name "${n}" is already taken.`, 409);
      }
      p.name = n;
    });
  }

  removePlayer({ playerId }) {
    return this.transact(() => {
      const p = this.player(playerId);
      this.s.players = this.s.players.filter((x) => x.id !== p.id);
      const v = this.s.vote;
      if (v) {
        v.candidates = v.candidates.filter((id) => id !== p.id);
        v.eligible = v.eligible.filter((id) => id !== p.id);
        for (const [voter, target] of Object.entries(v.ballots)) {
          if (voter === p.id || target === p.id) delete v.ballots[voter];
        }
        if (v.result) v.result = this.computeResult(v);
      }
      if (this.s.night) {
        for (const [voter, target] of Object.entries(this.s.night.ballots)) {
          if (voter === p.id || target === p.id) delete this.s.night.ballots[voter];
        }
      }
      if (this.s.recruitOffer && this.s.recruitOffer.playerId === p.id) this.s.recruitOffer = null;
      if (this.s.breakfast && this.s.breakfast.murderId === p.id) {
        this.s.breakfast = { murderId: null, blocked: false };
      }
    });
  }

  setRole({ playerId, role }) {
    return this.transact(() => {
      const p = this.player(playerId);
      if (role === null && !this.started()) {
        p.role = null;
        return;
      }
      if (!ROLES.includes(role)) throw new GameError('Role must be "faithful" or "traitor".');
      p.role = role;
    });
  }

  setStatus({ playerId, status }) {
    return this.transact(() => {
      const p = this.player(playerId);
      if (!STATUSES.includes(status)) throw new GameError('Unknown status.');
      p.status = status;
      if (status === 'alive') p.roleRevealed = this.s.phase === 'ended';
      else if (status === 'murdered') p.roleRevealed = true;
      else p.roleRevealed = this.s.settings.revealRoleOnBanish || this.s.phase === 'ended';
    });
  }

  setShield({ playerId, value }) {
    return this.transact(() => {
      const p = this.player(playerId);
      p.shield = Boolean(value);
    });
  }

  assignRolesRandom({ count } = {}) {
    return this.transact(() => {
      this.requirePhase('lobby');
      const n = count === undefined || count === null ? this.s.settings.traitorCount : Number(count);
      if (!Number.isInteger(n) || n < 1) throw new GameError('There must be at least one Traitor.');
      if (n >= this.s.players.length) {
        throw new GameError(`With ${this.s.players.length} players you can have at most ${Math.max(0, this.s.players.length - 1)} Traitor(s).`);
      }
      const traitors = new Set(shuffle(this.s.players.map((p) => p.id)).slice(0, n));
      for (const p of this.s.players) p.role = traitors.has(p.id) ? 'traitor' : 'faithful';
      this.s.settings.traitorCount = Math.min(n, SETTING_RULES.traitorCount[1]);
    });
  }

  // ---------------------------------------------------------------- settings & announcements

  updateSettings(patch) {
    return this.transact(() => {
      if (!patch || typeof patch !== 'object') throw new GameError('Invalid settings.');
      for (const [key, value] of Object.entries(patch)) {
        const rule = SETTING_RULES[key];
        if (!rule) throw new GameError(`Unknown setting: ${key}`);
        if (rule === 'boolean') {
          if (typeof value !== 'boolean') throw new GameError(`${key} must be true or false.`);
        } else {
          const [min, max] = rule;
          if (!Number.isInteger(value) || value < min || value > max) {
            throw new GameError(`${key} must be a whole number between ${min} and ${max}.`);
          }
        }
        this.s.settings[key] = value;
      }
    });
  }

  announce({ text }) {
    return this.transact(() => {
      if (typeof text !== 'string' || !text.trim()) throw new GameError('Announcement text is empty.');
      if (text.length > 500) throw new GameError('Announcements can be at most 500 characters.');
      this.s.announcement = { text: text.trim(), at: this.now() };
    });
  }

  clearAnnouncement() {
    return this.transact(() => {
      this.s.announcement = null;
    });
  }

  // ---------------------------------------------------------------- game flow

  startGame() {
    return this.transact(() => {
      this.requirePhase('lobby');
      if (this.s.players.length < 3) throw new GameError('You need at least 3 players to start.');
      for (const p of this.s.players) if (!p.role) p.role = 'faithful';
      const traitors = this.s.players.filter((p) => p.role === 'traitor').length;
      if (traitors < 1) throw new GameError('Assign at least one Traitor before starting.');
      if (traitors >= this.s.players.length) throw new GameError('There must be at least one Faithful.');
      this.s.phase = 'day';
      this.s.round = 1;
      this.s.settings.joinOpen = false;
      this.s.lastEvent = { type: 'started', at: this.now() };
      this.addEvent(`The game has begun with ${this.s.players.length} players. Check your phone to see your role!`);
    });
  }

  openVote({ kind = 'banish', candidates } = {}) {
    return this.transact(() => {
      this.requirePhase('day');
      this.beginVote(kind, candidates);
    });
  }

  beginVote(kind, candidates) {
    if (!['banish', 'endgame'].includes(kind)) throw new GameError('Unknown vote type.');
    const alive = this.alive();
    if (alive.length < 2) throw new GameError('At least 2 players must be alive to vote.');
    let cands = [];
    if (kind === 'banish') {
      cands = Array.isArray(candidates) && candidates.length ? [...new Set(candidates)] : alive.map((p) => p.id);
      for (const id of cands) {
        const p = this.player(id);
        if (p.status !== 'alive') throw new GameError(`${p.name} is not alive and cannot be voted for.`);
      }
      if (cands.length < 1) throw new GameError('Choose at least one player to vote on.');
    }
    const seconds = this.s.settings.voteTimerSeconds;
    this.s.vote = {
      id: randomId(6),
      kind,
      round: this.s.round,
      candidates: cands,
      eligible: alive.map((p) => p.id),
      ballots: {},
      open: true,
      openedAt: this.now(),
      deadline: seconds > 0 ? this.now() + seconds * 1000 : null,
      closedAt: null,
      result: null,
    };
    this.s.phase = 'voting';
    this.s.lastEvent = null;
  }

  castVote(token, choice) {
    return this.transact(() => {
      const me = this.requirePlayer(token);
      const v = this.s.vote;
      if (this.s.phase !== 'voting' || !v || !v.open) throw new GameError('Voting is not open right now.', 409);
      if (me.status !== 'alive' || !v.eligible.includes(me.id)) {
        throw new GameError("You can't vote in this round.", 403);
      }
      if (v.kind === 'banish') {
        if (typeof choice !== 'string' || !v.candidates.includes(choice)) {
          throw new GameError('Pick one of the players on the ballot.');
        }
        if (choice === me.id) throw new GameError("You can't vote for yourself.");
      } else if (!['end', 'banish'].includes(choice)) {
        throw new GameError('Choose "end" or "banish".');
      }
      if (v.ballots[me.id] !== undefined && !this.s.settings.allowVoteChange) {
        throw new GameError('You have already voted.', 409);
      }
      v.ballots[me.id] = choice;
      if (this.s.settings.autoCloseWhenAllVoted && this.allVoted(v)) this.finishVote();
    });
  }

  allVoted(v) {
    const voters = v.eligible.filter((id) => {
      const p = this.s.players.find((x) => x.id === id);
      return p && p.status === 'alive' && this.canVoteIn(v, p.id);
    });
    return voters.length > 0 && voters.every((id) => v.ballots[id] !== undefined);
  }

  // A voter who is the only candidate has nobody to vote for.
  canVoteIn(v, playerId) {
    if (v.kind !== 'banish') return true;
    return v.candidates.some((c) => c !== playerId);
  }

  computeResult(v) {
    const validBallots = Object.entries(v.ballots).filter(([voter]) => this.s.players.some((p) => p.id === voter));
    const nonVoters = v.eligible.filter((id) => {
      const p = this.s.players.find((x) => x.id === id);
      return p && p.status === 'alive' && v.ballots[id] === undefined && this.canVoteIn(v, id);
    });
    if (v.kind === 'endgame') {
      const end = validBallots.filter(([, c]) => c === 'end').length;
      const banish = validBallots.filter(([, c]) => c === 'banish').length;
      return { end, banish, nonVoters, unanimousEnd: end > 0 && banish === 0 && nonVoters.length === 0 };
    }
    const counts = new Map(v.candidates.map((id) => [id, 0]));
    for (const [, target] of validBallots) if (counts.has(target)) counts.set(target, counts.get(target) + 1);
    const tally = [...counts.entries()]
      .map(([playerId, count]) => ({ playerId, count }))
      .sort((a, b) => b.count - a.count);
    const max = tally.length ? tally[0].count : 0;
    const leaders = max > 0 ? tally.filter((t) => t.count === max).map((t) => t.playerId) : [];
    return { tally, leaders, tie: leaders.length > 1, nonVoters, totalVotes: validBallots.length };
  }

  finishVote() {
    const v = this.s.vote;
    v.open = false;
    v.closedAt = this.now();
    v.result = this.computeResult(v);
    this.s.phase = 'results';
  }

  closeVote() {
    return this.transact(() => {
      this.requirePhase('voting');
      this.finishVote();
    });
  }

  // Called periodically; closes a vote whose timer has run out. Returns true if state changed.
  tick() {
    const v = this.s.vote;
    if (this.s.phase === 'voting' && v && v.open && v.deadline && this.now() >= v.deadline) {
      this.transact(() => this.finishVote());
      return true;
    }
    return false;
  }

  archiveVote(outcome) {
    const v = this.s.vote;
    if (!v) return;
    if (!v.result) v.result = this.computeResult(v);
    this.s.voteHistory.push({ ...v, open: false, outcome });
    if (this.s.voteHistory.length > 100) this.s.voteHistory.shift();
    this.s.vote = null;
  }

  banish({ playerId }) {
    return this.transact(() => {
      this.requirePhase('results');
      if (this.s.vote.kind !== 'banish') throw new GameError('This was not a banishment vote.', 409);
      const p = this.player(playerId);
      if (p.status !== 'alive') throw new GameError(`${p.name} is not alive.`);
      p.status = 'banished';
      p.roleRevealed = this.s.settings.revealRoleOnBanish;
      this.archiveVote({ banished: p.id });
      this.s.phase = 'day';
      this.s.lastEvent = {
        type: 'banished',
        playerId: p.id,
        name: p.name,
        role: p.roleRevealed ? p.role : null,
        at: this.now(),
      };
      const roleText = p.roleRevealed ? ` They were ${p.role === 'traitor' ? 'a TRAITOR' : 'FAITHFUL'}.` : '';
      this.addEvent(`${p.name} was banished at the Round Table.${roleText}`);
    });
  }

  noBanish() {
    return this.transact(() => {
      this.requirePhase('results', 'voting');
      this.archiveVote({ banished: null });
      this.s.phase = 'day';
      this.s.lastEvent = { type: 'no-banish', at: this.now() };
      this.addEvent('Nobody was banished this round.');
    });
  }

  revote({ candidates } = {}) {
    return this.transact(() => {
      this.requirePhase('results');
      const v = this.s.vote;
      if (v.kind !== 'banish') throw new GameError('Only banishment votes can be re-run.', 409);
      let cands = candidates;
      if (!Array.isArray(cands) || !cands.length) {
        cands = v.result && v.result.tie ? v.result.leaders : v.candidates;
      }
      cands = cands.filter((id) => this.s.players.some((p) => p.id === id && p.status === 'alive'));
      this.archiveVote({ revote: true });
      this.s.phase = 'day';
      this.beginVote('banish', cands);
      this.addEvent(`Re-vote between ${cands.map((id) => this.name(id)).join(', ')}.`);
    });
  }

  cancelVote() {
    return this.transact(() => {
      this.requirePhase('voting', 'results');
      this.s.vote = null;
      this.s.phase = 'day';
    });
  }

  resolveEndgameVote() {
    return this.transact(() => {
      this.requirePhase('results');
      const v = this.s.vote;
      if (v.kind !== 'endgame') throw new GameError('This was not an Endgame vote.', 409);
      const result = v.result || this.computeResult(v);
      this.archiveVote({ unanimousEnd: result.unanimousEnd });
      if (result.unanimousEnd) {
        this.finishGame();
      } else {
        this.s.phase = 'day';
        this.s.lastEvent = { type: 'endgame-continue', at: this.now() };
        this.addEvent('The vote to end the game was not unanimous. The banishments continue!');
      }
    });
  }

  // ---------------------------------------------------------------- night

  startNight({ mode = 'murder' } = {}) {
    return this.transact(() => {
      this.requirePhase('day');
      if (!NIGHT_MODES.includes(mode)) throw new GameError('Night mode must be "murder" or "recruit".');
      if (!this.alive().some((p) => p.role === 'traitor')) throw new GameError('There are no living Traitors.', 409);
      this.s.night = { mode, ballots: {}, startedAt: this.now(), round: this.s.round };
      this.s.recruitOffer = null;
      this.s.phase = 'night';
      this.s.lastEvent = null;
      this.addEvent('Night falls. The Traitors gather in their tower...');
    });
  }

  setNightMode({ mode }) {
    return this.transact(() => {
      this.requirePhase('night');
      if (!NIGHT_MODES.includes(mode)) throw new GameError('Night mode must be "murder" or "recruit".');
      this.s.night.mode = mode;
      this.s.night.ballots = {};
    });
  }

  nightVote(token, targetId) {
    return this.transact(() => {
      const me = this.requirePlayer(token);
      if (this.s.phase !== 'night') throw new GameError('It is not night time.', 409);
      if (me.role !== 'traitor' || me.status !== 'alive') throw new GameError('Only living Traitors can do that.', 403);
      const target = this.player(targetId);
      if (target.status !== 'alive' || target.role !== 'faithful') {
        throw new GameError('You can only choose a living Faithful.');
      }
      this.s.night.ballots[me.id] = target.id;
    });
  }

  sendRecruitOffer({ playerId }) {
    return this.transact(() => {
      this.requirePhase('night');
      const p = this.player(playerId);
      if (p.status !== 'alive' || p.role !== 'faithful') throw new GameError('Only a living Faithful can be recruited.');
      this.s.recruitOffer = { playerId: p.id, status: 'pending', at: this.now() };
    });
  }

  respondRecruit(token, accept) {
    return this.transact(() => {
      const me = this.requirePlayer(token);
      const offer = this.s.recruitOffer;
      if (!offer || offer.playerId !== me.id || offer.status !== 'pending') {
        throw new GameError('You have no recruitment offer.', 409);
      }
      if (typeof accept !== 'boolean') throw new GameError('Answer must be accept or decline.');
      offer.status = accept ? 'accepted' : 'declined';
      offer.respondedAt = this.now();
      if (accept) me.role = 'traitor';
    });
  }

  endNight({ murderId = null } = {}) {
    return this.transact(() => {
      this.requirePhase('night');
      let blocked = false;
      if (murderId) {
        const p = this.player(murderId);
        if (p.status !== 'alive') throw new GameError(`${p.name} is not alive.`);
        if (p.role === 'traitor') throw new GameError('Traitors cannot murder a fellow Traitor.');
        blocked = Boolean(p.shield);
      }
      this.s.breakfast = { murderId: murderId || null, blocked };
      this.s.night = null;
      if (this.s.recruitOffer && this.s.recruitOffer.status === 'pending') this.s.recruitOffer.status = 'expired';
      this.s.phase = 'breakfast';
      this.s.lastEvent = null;
    });
  }

  revealBreakfast() {
    return this.transact(() => {
      this.requirePhase('breakfast');
      const { murderId, blocked } = this.s.breakfast || {};
      const victim = murderId ? this.s.players.find((p) => p.id === murderId) : null;
      if (victim && !blocked && victim.status === 'alive') {
        victim.status = 'murdered';
        victim.roleRevealed = true;
        this.s.lastEvent = { type: 'murdered', playerId: victim.id, name: victim.name, role: victim.role, at: this.now() };
        this.addEvent(`${victim.name} was murdered in the night.`);
      } else if (victim && blocked) {
        this.s.lastEvent = { type: 'shielded', at: this.now() };
        this.addEvent('The Traitors struck, but a shield saved their victim. Nobody was murdered.');
      } else {
        this.s.lastEvent = { type: 'no-murder', at: this.now() };
        this.addEvent('Everyone made it to breakfast. Nobody was murdered.');
      }
      for (const p of this.s.players) p.shield = false;
      this.s.breakfast = null;
      this.s.recruitOffer = null;
      this.s.round += 1;
      this.s.phase = 'day';
    });
  }

  // ---------------------------------------------------------------- ending

  finishGame(winner) {
    const sum = this.summary();
    const w = winner || (sum.aliveTraitors > 0 ? 'traitors' : 'faithful');
    if (!['traitors', 'faithful'].includes(w)) throw new GameError('Winner must be "traitors" or "faithful".');
    if (this.s.vote) this.archiveVote({ ended: true });
    this.s.night = null;
    this.s.breakfast = null;
    this.s.recruitOffer = null;
    this.s.phase = 'ended';
    this.s.winner = w;
    for (const p of this.s.players) p.roleRevealed = true;
    this.s.lastEvent = { type: 'ended', winner: w, at: this.now() };
    this.addEvent(w === 'traitors' ? 'The game is over. The TRAITORS win!' : 'The game is over. The FAITHFUL win!');
  }

  endGame({ winner } = {}) {
    return this.transact(() => {
      if (this.s.phase === 'lobby') throw new GameError('The game has not started yet.', 409);
      if (this.s.phase === 'ended') throw new GameError('The game is already over.', 409);
      this.finishGame(winner || undefined);
    });
  }

  resetGame({ keepPlayers = true } = {}) {
    return this.transact(() => {
      const settings = { ...this.s.settings, joinOpen: true };
      const players = keepPlayers
        ? this.s.players.map((p) => ({ ...p, role: null, status: 'alive', shield: false, roleRevealed: false }))
        : [];
      const rev = this.s.rev;
      this.state = freshState(settings);
      this.state.rev = rev;
      this.state.players = players;
    });
  }

  // ---------------------------------------------------------------- views

  publicPlayer(p) {
    const showRole = p.roleRevealed || this.s.phase === 'ended';
    return { id: p.id, name: p.name, status: p.status, role: showRole ? p.role : null };
  }

  fullResults(v) {
    const result = v.result || this.computeResult(v);
    const ballots = Object.entries(v.ballots)
      .filter(([voter]) => this.s.players.some((p) => p.id === voter))
      .map(([voterId, choice]) => ({
        voterId,
        voterName: this.name(voterId),
        choice,
        targetName: v.kind === 'banish' ? this.name(choice) : null,
      }));
    const out = { ballots, nonVoters: result.nonVoters.map((id) => ({ id, name: this.name(id) })) };
    if (v.kind === 'banish') {
      out.tally = result.tally.map((t) => ({ ...t, name: this.name(t.playerId) }));
      out.leaders = result.leaders.map((id) => ({ id, name: this.name(id) }));
      out.tie = result.tie;
      out.totalVotes = result.totalVotes;
    } else {
      out.end = result.end;
      out.banish = result.banish;
      out.unanimousEnd = result.unanimousEnd;
    }
    return out;
  }

  voteCommon(v) {
    const voters = v.eligible.filter((id) => this.s.players.some((p) => p.id === id && p.status === 'alive') && this.canVoteIn(v, id));
    return {
      id: v.id,
      kind: v.kind,
      open: v.open,
      round: v.round,
      deadline: v.deadline,
      candidates: v.candidates.map((id) => ({ id, name: this.name(id) })),
      eligibleCount: voters.length,
      votedCount: voters.filter((id) => v.ballots[id] !== undefined).length,
    };
  }

  playerView(token) {
    const me = this.requirePlayer(token);
    const s = this.s;
    const started = this.started();
    const view = {
      rev: s.rev,
      phase: s.phase,
      round: s.round,
      winner: s.winner,
      announcement: s.announcement,
      lastEvent: s.lastEvent,
      events: s.events.slice(-40),
      me: {
        id: me.id,
        name: me.name,
        code: me.code,
        status: me.status,
        role: started ? me.role : null,
        shield: started ? me.shield : false,
      },
      players: s.players.map((p) => this.publicPlayer(p)),
      fellowTraitors: [],
      vote: null,
      night: null,
      recruitOffer: null,
      settings: {
        showVotersToTarget: s.settings.showVotersToTarget,
        revealVotesAfterClose: s.settings.revealVotesAfterClose,
        allowVoteChange: s.settings.allowVoteChange,
      },
    };
    if (started && me.role === 'traitor' && s.settings.traitorsKnowEachOther) {
      view.fellowTraitors = s.players
        .filter((p) => p.role === 'traitor' && p.id !== me.id)
        .map((p) => ({ id: p.id, name: p.name, status: p.status }));
    }
    const v = s.vote;
    if (v && (s.phase === 'voting' || s.phase === 'results')) {
      const myBallot = v.ballots[me.id];
      const vv = {
        ...this.voteCommon(v),
        canVote: v.open && me.status === 'alive' && v.eligible.includes(me.id) && this.canVoteIn(v, me.id),
        myBallot: myBallot === undefined ? null : myBallot,
        myBallotName: myBallot === undefined || v.kind !== 'banish' ? null : this.name(myBallot),
        votersForMe: null,
        results: null,
      };
      if (s.settings.showVotersToTarget && v.kind === 'banish' && myBallot !== undefined) {
        vv.votersForMe = Object.entries(v.ballots)
          .filter(([, target]) => target === me.id)
          .map(([voter]) => this.name(voter));
      }
      if (!v.open && s.settings.revealVotesAfterClose) vv.results = this.fullResults(v);
      view.vote = vv;
    }
    if (s.phase === 'night' && s.night && me.role === 'traitor' && me.status === 'alive') {
      view.night = {
        mode: s.night.mode,
        myTarget: s.night.ballots[me.id] || null,
        targets: s.players
          .filter((p) => p.status === 'alive' && p.role === 'faithful')
          .map((p) => ({ id: p.id, name: p.name })),
        ballots: Object.entries(s.night.ballots).map(([t, target]) => ({ traitorName: this.name(t), targetName: this.name(target) })),
        recruitOffer: s.recruitOffer ? { name: this.name(s.recruitOffer.playerId), status: s.recruitOffer.status } : null,
      };
    }
    const offer = s.recruitOffer;
    if (offer && offer.playerId === me.id && s.phase === 'night') view.recruitOffer = { status: offer.status };
    return view;
  }

  screenView() {
    const s = this.s;
    const view = {
      rev: s.rev,
      phase: s.phase,
      round: s.round,
      winner: s.winner,
      announcement: s.announcement,
      lastEvent: s.lastEvent,
      events: s.events.slice(-12),
      players: s.players.map((p) => this.publicPlayer(p)),
      joinOpen: s.settings.joinOpen,
      vote: null,
    };
    const v = s.vote;
    if (v && (s.phase === 'voting' || s.phase === 'results')) {
      view.vote = { ...this.voteCommon(v), results: !v.open && s.settings.revealVotesAfterClose ? this.fullResults(v) : null };
    }
    return view;
  }

  adminView() {
    const s = this.s;
    const v = s.vote;
    return {
      rev: s.rev,
      phase: s.phase,
      round: s.round,
      winner: s.winner,
      settings: s.settings,
      announcement: s.announcement,
      lastEvent: s.lastEvent,
      events: s.events.slice(-60),
      summary: this.summary(),
      players: s.players.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        role: p.role,
        status: p.status,
        shield: p.shield,
        roleRevealed: p.roleRevealed,
      })),
      vote: v ? { ...this.voteCommon(v), live: this.fullResults(v) } : null,
      night: s.night
        ? {
            mode: s.night.mode,
            ballots: Object.entries(s.night.ballots).map(([t, target]) => ({
              traitorId: t,
              traitorName: this.name(t),
              targetId: target,
              targetName: this.name(target),
            })),
          }
        : null,
      recruitOffer: s.recruitOffer ? { ...s.recruitOffer, name: this.name(s.recruitOffer.playerId) } : null,
      breakfast: s.breakfast
        ? { ...s.breakfast, name: s.breakfast.murderId ? this.name(s.breakfast.murderId) : null }
        : null,
      voteHistory: s.voteHistory.slice(-20).map((h) => ({
        kind: h.kind,
        round: h.round,
        outcome: h.outcome,
        results: this.fullResults(h),
      })),
    };
  }
}

// Admin actions exposed over HTTP: name -> method. Anything not listed is rejected.
const ADMIN_ACTIONS = [
  'addPlayer',
  'renamePlayer',
  'removePlayer',
  'setRole',
  'setStatus',
  'setShield',
  'assignRolesRandom',
  'updateSettings',
  'announce',
  'clearAnnouncement',
  'startGame',
  'openVote',
  'closeVote',
  'banish',
  'noBanish',
  'revote',
  'cancelVote',
  'resolveEndgameVote',
  'startNight',
  'setNightMode',
  'sendRecruitOffer',
  'endNight',
  'revealBreakfast',
  'endGame',
  'resetGame',
];

module.exports = { Game, GameError, DEFAULT_SETTINGS, ADMIN_ACTIONS, freshState, normalizeName };
