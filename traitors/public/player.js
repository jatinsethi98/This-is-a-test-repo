'use strict';

(() => {
  const { esc, api, poll, storageGet, storageSet, toast, roleLabel, PHASE_LABEL, eventCard, winnerBanner } = T;
  const TOKEN_KEY = 'traitors.playerToken';

  let token = storageGet(TOKEN_KEY);
  let state = null;
  let poller = null;
  const ui = { roleShown: false, selected: null, selectedFor: null, editing: false, busy: false };

  const $ = (id) => document.getElementById(id);

  // Only touch the DOM when the content actually changed (keeps scroll/focus stable).
  function setHtml(el, html) {
    if (el._html !== html) {
      el.innerHTML = html;
      el._html = html;
    }
  }

  function headers() {
    return token ? { 'X-Player-Token': token } : {};
  }

  function showJoin() {
    $('join-view').hidden = false;
    $('game-view').hidden = true;
    $('phase').textContent = 'Not joined';
  }

  function signIn(newToken) {
    token = newToken;
    storageSet(TOKEN_KEY, token);
    $('join-view').hidden = true;
    $('game-view').hidden = false;
    startPolling();
  }

  function signOut(message) {
    token = null;
    storageSet(TOKEN_KEY, null);
    state = null;
    if (poller) poller.stop();
    poller = null;
    showJoin();
    if (message) toast(message, 'error');
  }

  function startPolling() {
    if (poller) poller.stop();
    poller = poll(() => api('/api/player/state', { headers: headers() }), {
      onData(data) {
        T.syncClock(data.serverNow);
        state = data;
        render();
      },
      onError(err) {
        if (err.status === 401) signOut('You are no longer in the game. Please join again.');
      },
    });
  }

  async function act(path, body) {
    if (ui.busy) return false;
    ui.busy = true;
    try {
      await api(path, { method: 'POST', body, headers: headers() });
      if (poller) poller.now();
      return true;
    } catch (err) {
      toast(err.message, 'error');
      if (poller) poller.now();
      return false;
    } finally {
      ui.busy = false;
    }
  }

  // ------------------------------------------------------------------ render

  function render() {
    if (!state) return;
    $('join-view').hidden = true;
    $('game-view').hidden = false;
    $('phase').textContent = (state.round ? `Round ${state.round} · ` : '') + (PHASE_LABEL[state.phase] || state.phase);

    setHtml($('announcement'), state.announcement ? `<div class="announcement">📣 ${esc(state.announcement.text)}</div>` : '');
    setHtml($('me'), renderMe());
    setHtml($('main'), renderMain());
    setHtml($('roster'), renderRoster());
    setHtml($('history'), renderHistory());
  }

  function renderMe() {
    const me = state.me;
    const statusText =
      me.status === 'banished'
        ? '<div class="notice warn" style="margin-top:10px">You have been banished. You can still watch, but you can no longer vote.</div>'
        : me.status === 'murdered'
          ? '<div class="notice warn" style="margin-top:10px">You were murdered by the Traitors. You can still watch, but you can no longer vote.</div>'
          : '';
    let roleBlock = '';
    if (!me.role) {
      roleBlock = '<p class="muted small" style="margin:8px 0 0">Your secret role will appear here once the host starts the game.</p>';
    } else if (!ui.roleShown) {
      roleBlock = `<button class="block" data-action="toggle-role" style="margin-top:10px">🔒 Tap to see your secret role</button>`;
    } else {
      const fellows =
        me.role === 'traitor' && state.fellowTraitors.length
          ? `<p class="small">Your fellow Traitors: ${state.fellowTraitors
              .map((f) => `<strong>${esc(f.name)}</strong>${f.status !== 'alive' ? ` (${esc(f.status)})` : ''}`)
              .join(', ')}</p>`
          : me.role === 'traitor'
            ? '<p class="small muted">You are working alone.</p>'
            : '<p class="small muted">Find the Traitors and banish them at the Round Table.</p>';
      const shield = me.shield ? '<p><span class="badge shield">🛡 You hold a shield — you cannot be murdered tonight</span></p>' : '';
      roleBlock = `<div class="role-card ${me.role}" style="margin-top:10px">
          <div class="muted small">You are</div>
          <div class="role-name">${esc(roleLabel(me.role))}</div>
          ${fellows}${shield}
          <button class="small" data-action="toggle-role">Hide</button>
        </div>`;
    }
    return `<div class="card">
        <div class="row" style="justify-content:space-between">
          <div><span class="muted small">Playing as</span><br><strong style="font-size:20px">${esc(me.name)}</strong></div>
          <div class="small muted center">Rejoin code<br><span class="mono">${esc(me.code)}</span></div>
        </div>
        ${roleBlock}${statusText}
      </div>`;
  }

  function progress(v) {
    const pct = v.eligibleCount ? Math.round((v.votedCount / v.eligibleCount) * 100) : 0;
    return `<div class="small muted" style="margin-top:12px">${v.votedCount} of ${v.eligibleCount} have voted${
      v.deadline && v.open ? ` · <span data-deadline="${v.deadline}">${T.countdownText(v.deadline)}</span> left` : ''
    }</div><div class="progress"><div style="width:${pct}%"></div></div>`;
  }

  function renderTally(results) {
    if (!results.tally) {
      return `<p>End the game: <strong>${results.end}</strong> · Banish again: <strong>${results.banish}</strong></p>`;
    }
    const max = Math.max(1, ...results.tally.map((t) => t.count));
    const leaders = new Set(results.leaders.map((l) => l.id));
    return results.tally
      .map(
        (t) => `<div class="tally-row ${leaders.has(t.playerId) ? 'leader' : ''}">
          <div>${esc(t.name)}</div><div><div class="bar" style="width:${(t.count / max) * 100}%"></div></div><div>${t.count}</div>
        </div>`,
      )
      .join('');
  }

  function renderBallots(results) {
    if (!results.ballots.length) return '';
    return `<details open style="margin-top:10px"><summary>Who voted for whom</summary><ul class="plain">${results.ballots
      .map(
        (b) =>
          `<li><span>${esc(b.voterName)}</span><span>→ <strong>${esc(
            b.targetName || (b.choice === 'end' ? 'End the game' : 'Banish again'),
          )}</strong></span></li>`,
      )
      .join('')}</ul></details>`;
  }

  function votersForMeBlock(v) {
    if (!v.votersForMe) return '';
    const list = v.votersForMe.length
      ? v.votersForMe.map((n) => `<strong>${esc(n)}</strong>`).join(', ')
      : '<span class="muted">Nobody' + (v.open ? ' (yet)' : '') + '</span>';
    return `<div class="notice" style="margin-top:12px">Voted for you${v.open ? ' so far' : ''}: ${list}</div>`;
  }

  function renderVoting(v) {
    if (ui.selectedFor !== v.id) {
      ui.selected = null;
      ui.selectedFor = v.id;
      ui.editing = false;
    }
    const me = state.me;
    let body = '';
    if (!v.canVote) {
      body = '<p class="muted">You are not voting this round. Watch the drama unfold!</p>';
    } else if (v.kind === 'endgame') {
      const mine = v.myBallot;
      body = `<h2>The Endgame</h2>
        <p>Do you believe every Traitor has been caught? The game only ends if <strong>everyone</strong> votes to end it.</p>
        <div class="choice-grid">
          <button class="choice ${mine === 'end' ? 'selected' : ''}" data-action="vote" data-choice="end" ${mine && !state.settings.allowVoteChange ? 'disabled' : ''}>End the game</button>
          <button class="choice ${mine === 'banish' ? 'selected' : ''}" data-action="vote" data-choice="banish" ${mine && !state.settings.allowVoteChange ? 'disabled' : ''}>Banish again</button>
        </div>
        ${mine ? `<p class="small muted">You voted to <strong>${mine === 'end' ? 'end the game' : 'banish again'}</strong>.</p>` : ''}`;
    } else if (v.myBallot && !ui.editing) {
      body = `<h2>Vote cast</h2>
        <p>You voted for <strong>${esc(v.myBallotName)}</strong>.</p>
        ${state.settings.allowVoteChange ? '<button data-action="change-vote">Change my vote</button>' : ''}
        ${votersForMeBlock(v)}`;
    } else {
      const options = v.candidates.filter((c) => c.id !== me.id);
      const sel = options.find((o) => o.id === ui.selected);
      body = `<h2>Who is a Traitor?</h2>
        <p class="muted small">Tap a name, then confirm. ${state.settings.allowVoteChange ? 'You can change your vote until voting closes.' : 'Your vote is final once cast.'}</p>
        <div class="choice-grid">${options
          .map(
            (o) =>
              `<button class="choice ${o.id === ui.selected ? 'selected' : ''}" data-action="select" data-id="${esc(o.id)}">${esc(o.name)}</button>`,
          )
          .join('')}</div>
        <button class="primary block" style="margin-top:14px" data-action="confirm-vote" ${sel ? '' : 'disabled'}>
          ${sel ? `Cast my vote for ${esc(sel.name)}` : 'Select a player'}
        </button>
        ${ui.editing ? '<button class="block small" style="margin-top:8px" data-action="cancel-change">Keep my current vote</button>' : ''}`;
    }
    return `<div class="card highlight">${body}${progress(v)}</div>`;
  }

  function renderResults(v) {
    const mine =
      v.myBallot && v.kind === 'banish'
        ? `<p class="small muted">You voted for <strong>${esc(v.myBallotName)}</strong>.</p>`
        : '';
    if (!v.results) {
      return `<div class="card highlight"><h2>Voting has closed</h2>
        <p class="muted">The host will now reveal the votes…</p>${mine}${votersForMeBlock(v)}</div>`;
    }
    const r = v.results;
    let headline = '';
    if (v.kind === 'banish') {
      headline = r.tie
        ? `<p><strong>It's a tie</strong> between ${r.leaders.map((l) => esc(l.name)).join(' and ')}.</p>`
        : r.leaders.length
          ? `<p>Most votes: <strong>${esc(r.leaders[0].name)}</strong></p>`
          : '<p>No votes were cast.</p>';
    } else {
      headline = r.unanimousEnd ? '<p><strong>Unanimous — the game will end!</strong></p>' : '<p>Not unanimous — the game continues.</p>';
    }
    return `<div class="card highlight"><h2>The votes are in</h2>${headline}${renderTally(r)}${renderBallots(r)}${mine}${votersForMeBlock(v)}
      <p class="small muted">Waiting for the host…</p></div>`;
  }

  function renderNight() {
    if (state.recruitOffer && state.recruitOffer.status === 'pending') {
      return `<div class="card highlight center">
          <h2>A message in the dark…</h2>
          <p>The Traitors want you to <strong>join them</strong>. Will you become a Traitor?</p>
          <div class="row" style="justify-content:center">
            <button class="primary" data-action="recruit" data-accept="1">Accept — become a Traitor</button>
            <button data-action="recruit" data-accept="0">Decline</button>
          </div>
        </div>`;
    }
    if (state.recruitOffer && state.recruitOffer.status === 'accepted') {
      return '<div class="card center"><h2>Welcome to the Traitors.</h2><p class="muted">Check your role card. Keep your secret safe.</p></div>';
    }
    const n = state.night;
    if (!n) {
      return `<div class="card center"><h2>🌙 Night has fallen</h2>
        <p class="muted">The Traitors are choosing their next move. Put your phone down and wait for breakfast…</p></div>`;
    }
    const verb = n.mode === 'murder' ? 'murder' : 'recruit';
    const offer = n.recruitOffer
      ? `<p class="small">Recruitment offer sent to <strong>${esc(n.recruitOffer.name)}</strong>: ${esc(n.recruitOffer.status)}</p>`
      : '';
    return `<div class="card highlight">
        <h2>🗡 The Traitors' Tower</h2>
        <p>Choose who to <strong>${verb}</strong> tonight. Agree with your fellow Traitors — the host makes it final.</p>
        <div class="choice-grid">${n.targets
          .map(
            (t) =>
              `<button class="choice ${t.id === n.myTarget ? 'selected' : ''}" data-action="night" data-id="${esc(t.id)}">${esc(t.name)}</button>`,
          )
          .join('')}</div>
        ${
          n.ballots.length
            ? `<ul class="plain" style="margin-top:12px">${n.ballots
                .map((b) => `<li><span>${esc(b.traitorName)}</span><span>wants to ${verb} <strong>${esc(b.targetName)}</strong></span></li>`)
                .join('')}</ul>`
            : '<p class="small muted">No Traitor has chosen yet.</p>'
        }
        ${offer}
      </div>`;
  }

  function renderMain() {
    const s = state;
    switch (s.phase) {
      case 'lobby':
        return `<div class="card center"><h2>You're in!</h2><p class="muted">Waiting for the host to start the game. ${s.players.length} player${
          s.players.length === 1 ? ' has' : 's have'
        } joined.</p></div>`;
      case 'day':
        return `<div class="card">${eventCard(s.lastEvent) || ''}<p class="muted center">Waiting for the host…</p></div>`;
      case 'voting':
        return s.vote ? renderVoting(s.vote) : '';
      case 'results':
        return s.vote ? renderResults(s.vote) : '';
      case 'night':
        return renderNight();
      case 'breakfast':
        return '<div class="card center"><h2>☕ Breakfast</h2><p class="muted">Everyone gathers for breakfast… who will walk through the door?</p></div>';
      case 'ended':
        return `${winnerBanner(s.winner)}<div class="card">${eventCard(s.lastEvent) || ''}<p class="center muted">Thanks for playing! All roles are revealed below.</p></div>`;
      default:
        return '';
    }
  }

  function renderRoster() {
    const fellow = new Set(ui.roleShown ? state.fellowTraitors.map((f) => f.id) : []);
    const items = state.players
      .map((p) => {
        const out = p.status !== 'alive';
        const role = p.role ? `<span class="badge ${p.role}">${roleLabel(p.role)}</span>` : '';
        const status = out ? `<span class="badge ${p.status}">${p.status}</span>` : '';
        const me = p.id === state.me.id ? ' <span class="muted small">(you)</span>' : '';
        const f = fellow.has(p.id) && !p.role ? ' <span class="badge traitor">fellow Traitor</span>' : '';
        return `<li><span class="${out ? 'out' : ''}">${esc(p.name)}${me}${f}</span><span>${status} ${role}</span></li>`;
      })
      .join('');
    const alive = state.players.filter((p) => p.status === 'alive').length;
    return `<div class="card"><h3>Players <span class="muted small">(${alive} still in)</span></h3><ul class="plain">${items}</ul></div>`;
  }

  function renderHistory() {
    if (!state.events.length) return '';
    return `<details class="card"><summary>Game history</summary><ul class="plain history" style="margin-top:8px">${state.events
      .slice()
      .reverse()
      .map((e) => `<li>${e.round ? `<span class="muted small">R${e.round}</span> ` : ''}${esc(e.text)}</li>`)
      .join('')}</ul></details>`;
  }

  // ------------------------------------------------------------------ events

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    if (action === 'toggle-role') {
      ui.roleShown = !ui.roleShown;
      render();
    } else if (action === 'select') {
      ui.selected = btn.dataset.id;
      render();
    } else if (action === 'confirm-vote') {
      if (!ui.selected) return;
      const ok = await act('/api/vote', { choice: ui.selected });
      if (ok) {
        ui.editing = false;
        toast('Your vote has been cast.', 'ok');
      }
    } else if (action === 'vote') {
      const ok = await act('/api/vote', { choice: btn.dataset.choice });
      if (ok) toast('Your vote has been cast.', 'ok');
    } else if (action === 'change-vote') {
      ui.editing = true;
      ui.selected = state.vote && state.vote.myBallot;
      render();
    } else if (action === 'cancel-change') {
      ui.editing = false;
      render();
    } else if (action === 'night') {
      await act('/api/night-vote', { targetId: btn.dataset.id });
    } else if (action === 'recruit') {
      const accept = btn.dataset.accept === '1';
      if (!confirm(accept ? 'Accept and become a Traitor?' : 'Decline the offer?')) return;
      await act('/api/recruit-response', { accept });
    }
  });

  $('join-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('join-name').value;
    try {
      const res = await api('/api/join', { method: 'POST', body: { name } });
      signIn(res.token);
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  $('rejoin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await api('/api/rejoin', { method: 'POST', body: { code: $('rejoin-code').value } });
      signIn(res.token);
      toast(`Welcome back, ${res.name}!`, 'ok');
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  if (token) {
    $('game-view').hidden = false;
    startPolling();
  } else {
    showJoin();
  }
})();
