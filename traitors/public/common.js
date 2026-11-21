'use strict';

/* Shared browser helpers for the player, admin and screen pages. */

const T = (() => {
  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  function storageSet(key, value) {
    try {
      if (value === null || value === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      /* private mode: fine, we just won't remember */
    }
  }

  class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }

  async function api(path, { method = 'GET', body, headers = {}, timeoutMs = 8000 } = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res;
    try {
      res = await fetch(path, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: ctrl.signal,
        cache: 'no-store',
      });
    } catch (err) {
      throw new ApiError("Can't reach the host laptop. Check you're on the same Wi-Fi.", 0);
    } finally {
      clearTimeout(timer);
    }
    let data = {};
    try {
      data = await res.json();
    } catch {
      /* ignore */
    }
    if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
    return data;
  }

  // Polls `fn` repeatedly; calls onData with each result. Retries forever with
  // a gentle backoff when the connection drops, and reports connection status.
  function poll(fn, { onData, onError, intervalMs = 1500 } = {}) {
    let stopped = false;
    let failures = 0;
    let timer = null;
    async function run() {
      if (stopped) return;
      try {
        const data = await fn();
        failures = 0;
        setConnection(true);
        onData(data);
      } catch (err) {
        failures += 1;
        if (err.status === 0) setConnection(false);
        if (onError) onError(err);
      }
      if (!stopped) timer = setTimeout(run, failures ? Math.min(5000, intervalMs * (1 + failures)) : intervalMs);
    }
    run();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !stopped) {
        clearTimeout(timer);
        run();
      }
    });
    return {
      now() {
        clearTimeout(timer);
        run();
      },
      stop() {
        stopped = true;
        clearTimeout(timer);
      },
    };
  }

  function setConnection(ok) {
    const el = document.getElementById('conn');
    if (!el) return;
    el.hidden = ok;
  }

  let clockOffset = 0;
  function syncClock(serverNow) {
    if (typeof serverNow === 'number') clockOffset = serverNow - Date.now();
  }
  function serverTime() {
    return Date.now() + clockOffset;
  }

  function countdownText(deadline) {
    if (!deadline) return '';
    const ms = Math.max(0, deadline - serverTime());
    const s = Math.ceil(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  // Updates every [data-deadline] element with a live countdown.
  setInterval(() => {
    for (const el of document.querySelectorAll('[data-deadline]')) {
      el.textContent = countdownText(Number(el.dataset.deadline));
    }
  }, 250);

  let toastTimer = null;
  function toast(message, kind = 'info') {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      document.body.appendChild(el);
    }
    el.className = `toast ${kind}`;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), kind === 'error' ? 5000 : 2500);
  }

  function roleLabel(role) {
    if (role === 'traitor') return 'Traitor';
    if (role === 'faithful') return 'Faithful';
    return '';
  }

  const PHASE_LABEL = {
    lobby: 'Lobby',
    day: 'Day',
    voting: 'Round Table — voting',
    results: 'Round Table — results',
    night: 'Night',
    breakfast: 'Breakfast',
    ended: 'Game over',
  };

  function eventCard(ev) {
    if (!ev) return '';
    switch (ev.type) {
      case 'banished':
        return `<div class="event banished"><div class="big">${esc(ev.name)} has been banished.</div>${
          ev.role
            ? `<div class="reveal ${ev.role}">They were ${ev.role === 'traitor' ? 'a TRAITOR' : 'FAITHFUL'}.</div>`
            : '<div class="muted">Their role remains a secret.</div>'
        }</div>`;
      case 'murdered':
        return `<div class="event murdered"><div class="big">${esc(ev.name)} was murdered in the night.</div></div>`;
      case 'shielded':
        return '<div class="event"><div class="big">The Traitors struck… but a shield saved their victim!</div></div>';
      case 'no-murder':
        return '<div class="event"><div class="big">Everyone made it to breakfast.</div><div class="muted">Nobody was murdered.</div></div>';
      case 'no-banish':
        return '<div class="event"><div class="big">Nobody was banished this time.</div></div>';
      case 'endgame-continue':
        return '<div class="event"><div class="big">Not unanimous — the banishments continue!</div></div>';
      case 'started':
        return '<div class="event"><div class="big">The game has begun.</div></div>';
      default:
        return '';
    }
  }

  function winnerBanner(winner) {
    if (!winner) return '';
    return `<div class="winner ${winner === 'traitors' ? 'traitor' : 'faithful'}">${
      winner === 'traitors' ? 'The TRAITORS win!' : 'The FAITHFUL win!'
    }</div>`;
  }

  return {
    esc,
    api,
    poll,
    storageGet,
    storageSet,
    syncClock,
    serverTime,
    countdownText,
    toast,
    roleLabel,
    PHASE_LABEL,
    eventCard,
    winnerBanner,
  };
})();
