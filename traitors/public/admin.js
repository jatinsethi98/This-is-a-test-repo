'use strict';

(() => {
  const { esc, api, poll, storageGet, storageSet, toast, roleLabel, PHASE_LABEL, eventCard, winnerBanner } = T;
  const KEY = 'traitors.adminKey';
  const $ = (id) => document.getElementById(id);

  let adminKey = storageGet(KEY);
  let state = null;
  let poller = null;
  let busy = false;

  const SETTINGS = [
    ['showVotersToTarget', 'Players see who voted for them', 'After a player casts their vote, they can see which players voted for them (updates live).'],
    ['revealVotesAfterClose', 'Reveal all votes when voting closes', 'Everyone sees the full tally and who voted for whom once you close voting. Off = only you see it.'],
    ['revealRoleOnBanish', "Reveal a banished player's role", 'Announce whether the banished player was a Traitor or Faithful.'],
    ['allowVoteChange', 'Players can change their vote', 'Until voting closes. Off = votes are final.'],
    ['traitorsKnowEachOther', 'Traitors know each other', 'Traitors see who their fellow Traitors are.'],
    ['autoCloseWhenAllVoted', 'Close voting automatically', 'Voting closes as soon as everyone has voted.'],
    ['joinOpen', 'Allow new players to join', 'Turned off automatically when the game starts.'],
  ];

  function setHtml(el, html) {
    if (el._html !== html) {
      el.innerHTML = html;
      el._html = html;
    }
  }

  function headers() {
    return { 'X-Admin-Key': adminKey || '' };
  }

  async function action(name, params = {}, okMessage) {
    if (busy) return null;
    busy = true;
    try {
      const res = await api('/api/admin/action', { method: 'POST', body: { action: name, params }, headers: headers() });
      if (okMessage) toast(okMessage, 'ok');
      return res;
    } catch (err) {
      toast(err.message, 'error');
      if (err.status === 401 || err.status === 429) logout();
      return null;
    } finally {
      busy = false;
      if (poller) poller.now();
    }
  }

  function logout() {
    adminKey = null;
    storageSet(KEY, null);
    if (poller) poller.stop();
    poller = null;
    state = null;
    $('app').hidden = true;
    $('logout').hidden = true;
    $('login-view').hidden = false;
  }

  function start() {
    $('login-view').hidden = true;
    $('app').hidden = false;
    $('logout').hidden = false;
    if (poller) poller.stop();
    poller = poll(() => api('/api/admin/state', { headers: headers() }), {
      intervalMs: 1000,
      onData(data) {
        T.syncClock(data.serverNow);
        state = data;
        render();
      },
      onError(err) {
        if (err.status === 401 || err.status === 429) {
          toast(err.message, 'error');
          logout();
        }
      },
    });
  }

  const nameOf = (id) => (state.players.find((p) => p.id === id) || {}).name || '?';

  // ------------------------------------------------------------------ render

  function render() {
    const s = state;
    $('phase').textContent = (s.round ? `Round ${s.round} · ` : '') + (PHASE_LABEL[s.phase] || s.phase);
    renderStatus();
    renderFlow();
    renderVote();
    renderNight();
    renderPlayers();
    renderSettings();
    setHtml(
      $('announcement-current'),
      s.announcement ? `<div class="announcement">📣 ${esc(s.announcement.text)}</div>` : '<p class="muted small">No announcement showing.</p>',
    );
    renderHistory();
  }

  function renderStatus() {
    const s = state;
    const sum = s.summary;
    const url = s.joinUrls[0] || location.origin + '/';
    const others = s.joinUrls.slice(1);
    let qr = '';
    try {
      const q = qrcode(0, 'M');
      q.addData(url);
      q.make();
      qr = q.createSvgTag({ cellSize: 3, margin: 2 });
    } catch {
      qr = '';
    }
    const counts =
      s.phase === 'lobby'
        ? `<strong>${sum.total}</strong> player${sum.total === 1 ? '' : 's'} joined`
        : `<strong>${sum.alive}</strong> alive · <span class="badge traitor">${sum.aliveTraitors} Traitor${sum.aliveTraitors === 1 ? '' : 's'}</span> <span class="badge faithful">${sum.aliveFaithful} Faithful</span>`;
    setHtml(
      $('status'),
      `<div class="card">
        <div class="row" style="justify-content:space-between;align-items:flex-start">
          <div class="stack">
            <div>Players join at <a href="${esc(url)}" class="mono">${esc(url)}</a>${
              others.length ? `<br><span class="small muted">Other networks: ${others.map(esc).join(', ')}</span>` : ''
            }</div>
            <div class="small muted">Big screen / TV: <a href="/screen" target="_blank">${esc(url)}screen</a></div>
            <div>${counts}</div>
            ${sum.suggestion ? `<div class="notice warn">💡 ${esc(sum.suggestion)}</div>` : ''}
            ${s.winner ? winnerBanner(s.winner) : ''}
          </div>
          <div style="background:#fff;padding:6px;border-radius:8px;line-height:0">${qr}</div>
        </div>
      </div>`,
    );
  }

  function renderFlow() {
    const s = state;
    const lobby = s.phase === 'lobby';
    $('lobby-controls').hidden = !lobby;
    if (lobby) {
      const n = s.players.length;
      const t = s.players.filter((p) => p.role === 'traitor').length;
      $('lobby-hint').textContent = `${n} player${n === 1 ? '' : 's'} joined. ${t} assigned as Traitor${t === 1 ? '' : 's'}. ${
        n < 3 ? 'You need at least 3 players.' : ''
      } A good rule of thumb is 1 Traitor per 4–5 players.`;
      if (document.activeElement !== $('traitor-count') && !$('traitor-count')._touched) {
        $('traitor-count').value = s.settings.traitorCount;
      }
    }
    let html = '';
    switch (s.phase) {
      case 'day':
        html = `${eventCard(s.lastEvent)}
          <p class="muted small">Typical round: <strong>Round Table vote</strong> → banish → <strong>Night</strong> (Traitors murder) → <strong>Breakfast</strong> reveal → repeat. ${
            s.settings.voteTimerSeconds ? `Vote timer: ${s.settings.voteTimerSeconds}s.` : ''
          }</p>
          <div class="stack">
            <button class="primary block" data-act="open-vote">⚖️ Open Round Table vote (banishment)</button>
            <div class="row">
              <button class="grow" data-act="night" data-mode="murder">🌙 Start night — murder</button>
              <button class="grow" data-act="night" data-mode="recruit">🤝 Start night — recruit</button>
            </div>
            <button class="block" data-act="open-endgame">🏁 Open Endgame vote (end game or banish again)</button>
          </div>`;
        break;
      case 'voting': {
        const v = s.vote;
        html = `<p>${v.kind === 'endgame' ? 'Endgame vote' : 'Round Table vote'} is <strong>open</strong>. ${v.votedCount} of ${v.eligibleCount} voted${
          v.deadline ? ` · <span data-deadline="${v.deadline}">${T.countdownText(v.deadline)}</span> left` : ''
        }.</p>
          <div class="row">
            <button class="primary grow" data-act="close-vote">Close voting &amp; show results</button>
            <button data-act="cancel-vote">Cancel vote</button>
          </div>`;
        break;
      }
      case 'results': {
        const v = s.vote;
        const r = v.live;
        if (v.kind === 'endgame') {
          html = `<p>Endgame result: <strong>${r.end}</strong> to end, <strong>${r.banish}</strong> to banish again${
            r.nonVoters.length ? `, ${r.nonVoters.length} didn't vote` : ''
          }. ${r.unanimousEnd ? '<strong>Unanimous — the game ends.</strong>' : 'Not unanimous — the game continues.'}</p>
            <button class="primary block" data-act="resolve-endgame">${r.unanimousEnd ? 'End the game and reveal roles' : 'Continue to another banishment'}</button>`;
        } else {
          const leaders = new Set(r.leaders.map((l) => l.id));
          html = `<p>${
            r.tie
              ? `<strong>Tie</strong> between ${r.leaders.map((l) => esc(l.name)).join(', ')}.`
              : r.leaders.length
                ? `<strong>${esc(r.leaders[0].name)}</strong> has the most votes.`
                : 'No votes were cast.'
          } Choose who to banish:</p>
            <div class="choice-grid">${r.tally
              .filter((t) => (state.players.find((p) => p.id === t.playerId) || {}).status === 'alive')
              .map(
                (t) =>
                  `<button class="choice ${leaders.has(t.playerId) ? 'selected' : ''}" data-act="banish" data-id="${esc(t.playerId)}">Banish ${esc(t.name)} <span class="small muted">(${t.count})</span></button>`,
              )
              .join('')}</div>
            <div class="row" style="margin-top:10px">
              ${r.tie ? '<button class="primary" data-act="revote-tied">Re-vote between the tied players</button>' : ''}
              <button data-act="revote-all">Re-vote (everyone)</button>
              <button data-act="no-banish">No banishment</button>
            </div>`;
        }
        break;
      }
      case 'night':
        html = '<p>It is <strong>night</strong>. The Traitors are choosing on their phones — see the Night panel below.</p>';
        break;
      case 'breakfast': {
        const b = s.breakfast || {};
        const what = b.murderId
          ? b.blocked
            ? `<strong>${esc(b.name)}</strong> was targeted but holds a <strong>shield</strong> — nobody dies.`
            : `<strong>${esc(b.name)}</strong> will be revealed as murdered.`
          : 'Nobody was murdered tonight.';
        html = `<p>☕ Breakfast. ${what} <span class="muted small">(only you can see this)</span></p>
          <button class="primary block" data-act="reveal-breakfast">Reveal to everyone</button>`;
        break;
      }
      case 'ended':
        html = `${winnerBanner(s.winner)}<button class="block" data-act="reset-keep">Start a new game with the same players</button>`;
        break;
      default:
        html = '';
    }
    setHtml($('flow'), html);
  }

  function tallyHtml(r) {
    if (!r.tally) return '';
    const max = Math.max(1, ...r.tally.map((t) => t.count));
    const leaders = new Set(r.leaders.map((l) => l.id));
    return r.tally
      .map(
        (t) => `<div class="tally-row ${leaders.has(t.playerId) ? 'leader' : ''}"><div>${esc(t.name)}</div>
          <div><div class="bar" style="width:${(t.count / max) * 100}%"></div></div><div>${t.count}</div></div>`,
      )
      .join('');
  }

  function ballotsHtml(r) {
    const rows = r.ballots
      .map(
        (b) =>
          `<li><span>${esc(b.voterName)}</span><span>→ <strong>${esc(b.targetName || (b.choice === 'end' ? 'End game' : 'Banish again'))}</strong></span></li>`,
      )
      .join('');
    const waiting = r.nonVoters.length
      ? `<p class="small muted">Not voted: ${r.nonVoters.map((n) => esc(n.name)).join(', ')}</p>`
      : '';
    return `<ul class="plain">${rows || '<li class="muted">No votes yet</li>'}</ul>${waiting}`;
  }

  function renderVote() {
    const v = state.vote;
    if (!v) return setHtml($('vote'), '');
    const r = v.live;
    const summary = v.kind === 'endgame' ? `<p>End: <strong>${r.end}</strong> · Banish again: <strong>${r.banish}</strong></p>` : tallyHtml(r);
    setHtml(
      $('vote'),
      `<div class="card"><h2>${v.kind === 'endgame' ? 'Endgame vote' : 'Round Table vote'} <span class="muted small">(${
        v.open ? 'live' : 'closed'
      } — only you see this live)</span></h2>${summary}<h3 style="margin-top:12px">Who voted for whom</h3>${ballotsHtml(r)}</div>`,
    );
  }

  function renderNight() {
    const s = state;
    if (s.phase !== 'night' || !s.night) return setHtml($('night'), '');
    const n = s.night;
    const picks = new Map();
    for (const b of n.ballots) picks.set(b.targetId, (picks.get(b.targetId) || 0) + 1);
    const faithful = s.players.filter((p) => p.status === 'alive' && p.role === 'faithful');
    const offer = s.recruitOffer;
    const offerHtml = offer
      ? `<div class="notice ${offer.status === 'accepted' ? 'warn' : ''}" style="margin-top:10px">Recruitment offer to <strong>${esc(offer.name)}</strong>: <strong>${esc(
          offer.status,
        )}</strong>${offer.status === 'pending' ? ' (waiting for them to answer on their phone)' : ''}</div>`
      : '';
    const btn = (p) => {
      const count = picks.get(p.id) || 0;
      const shield = p.shield ? ' 🛡' : '';
      if (n.mode === 'murder') {
        return `<button class="choice ${count ? 'selected' : ''}" data-act="murder" data-id="${esc(p.id)}">Murder ${esc(p.name)}${shield}${
          count ? `<br><span class="small">${count} Traitor vote${count === 1 ? '' : 's'}</span>` : ''
        }</button>`;
      }
      return `<button class="choice ${count ? 'selected' : ''}" data-act="recruit" data-id="${esc(p.id)}" ${
        offer && offer.status === 'pending' ? 'disabled' : ''
      }>Recruit ${esc(p.name)}${count ? `<br><span class="small">${count} Traitor vote${count === 1 ? '' : 's'}</span>` : ''}</button>`;
    };
    setHtml(
      $('night'),
      `<div class="card highlight">
        <h2>🌙 Night — ${n.mode === 'murder' ? 'Murder' : 'Recruitment'}</h2>
        <div class="row" style="margin-bottom:10px">
          <button class="small ${n.mode === 'murder' ? 'primary' : ''}" data-act="night-mode" data-mode="murder">Murder mode</button>
          <button class="small ${n.mode === 'recruit' ? 'primary' : ''}" data-act="night-mode" data-mode="recruit">Recruit mode</button>
        </div>
        <h3>Traitors' choices</h3>
        <ul class="plain">${
          n.ballots.map((b) => `<li><span>${esc(b.traitorName)}</span><span>→ <strong>${esc(b.targetName)}</strong></span></li>`).join('') ||
          '<li class="muted">No Traitor has chosen yet</li>'
        }</ul>
        <p class="small muted">${
          n.mode === 'murder'
            ? 'Click a name to confirm the murder (revealed at breakfast). 🛡 = holds a shield and will survive.'
            : 'Click a name to send them a recruitment offer on their phone.'
        }</p>
        <div class="choice-grid">${faithful.map(btn).join('')}</div>
        ${offerHtml}
        <button class="block" style="margin-top:12px" data-act="no-murder">${
          n.mode === 'murder' ? 'Nobody dies tonight → breakfast' : 'End the night (no murder) → breakfast'
        }</button>
      </div>`,
    );
  }

  function renderPlayers() {
    const s = state;
    const lobby = s.phase === 'lobby';
    if (!s.players.length) {
      return setHtml($('players'), '<p class="muted">Nobody has joined yet. Ask everyone to open the join link on their phone.</p>');
    }
    const rows = s.players
      .map((p) => {
        const roleOpts = (lobby ? [['', '— unassigned —']] : [])
          .concat([
            ['faithful', 'Faithful'],
            ['traitor', 'Traitor'],
          ])
          .map(([v, l]) => `<option value="${v}" ${(p.role || '') === v ? 'selected' : ''}>${l}</option>`)
          .join('');
        const statusOpts = ['alive', 'banished', 'murdered']
          .map((st) => `<option value="${st}" ${p.status === st ? 'selected' : ''}>${st}</option>`)
          .join('');
        return `<tr>
          <td><span class="${p.status !== 'alive' ? 'out' : ''}">${esc(p.name)}</span>${p.role ? ` <span class="badge ${p.role}">${roleLabel(p.role)}</span>` : ''}</td>
          <td class="mono small" title="Rejoin code">${esc(p.code)}</td>
          <td><select class="compact" data-change="role" data-id="${esc(p.id)}">${roleOpts}</select></td>
          <td>${lobby ? '' : `<select class="compact" data-change="status" data-id="${esc(p.id)}">${statusOpts}</select>`}</td>
          <td>${lobby ? '' : `<label title="Shield: survives one murder"><input type="checkbox" data-change="shield" data-id="${esc(p.id)}" ${p.shield ? 'checked' : ''}> 🛡</label>`}</td>
          <td class="row" style="flex-wrap:nowrap">
            <button class="small" data-act="rename" data-id="${esc(p.id)}" title="Rename">✏️</button>
            <button class="small danger" data-act="remove" data-id="${esc(p.id)}" title="Remove">✕</button>
          </td>
        </tr>`;
      })
      .join('');
    setHtml(
      $('players'),
      `<div style="overflow-x:auto"><table>
        <thead><tr><th>Name</th><th>Code</th><th>Role</th><th>${lobby ? '' : 'Status'}</th><th>${lobby ? '' : 'Shield'}</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>
        <p class="small muted">Code = rejoin code, if someone loses their phone or closes the page. Roles are secret: don't let players see this screen!</p>`,
    );
  }

  function renderSettings() {
    const st = state.settings;
    const toggles = SETTINGS.map(
      ([key, label, help]) => `<label class="toggle"><input type="checkbox" data-setting="${key}" ${st[key] ? 'checked' : ''}>
        <span><strong>${esc(label)}</strong><br><span class="small muted">${esc(help)}</span></span></label>`,
    ).join('');
    setHtml(
      $('settings'),
      `${toggles}
      <label class="toggle"><span style="flex:1"><strong>Vote timer</strong><br><span class="small muted">Seconds per vote; voting closes automatically. 0 = no timer.</span></span>
        <input type="number" class="compact" min="0" max="3600" step="15" data-setting-num="voteTimerSeconds" value="${st.voteTimerSeconds}" style="width:90px;height:auto"></label>`,
    );
  }

  function renderHistory() {
    const s = state;
    const votes = s.voteHistory
      .slice()
      .reverse()
      .map((h) => {
        const o = h.outcome || {};
        const outcome = o.banished
          ? `Banished ${esc(nameOf(o.banished))}`
          : o.revote
            ? 'Re-vote'
            : o.unanimousEnd
              ? 'Game ended'
              : o.ended
                ? 'Game ended'
                : h.kind === 'endgame'
                  ? 'Continued'
                  : 'No banishment';
        return `<details><summary>Round ${h.round} · ${h.kind === 'endgame' ? 'Endgame vote' : 'Round Table'} · ${outcome}</summary>${
          h.kind === 'banish' ? tallyHtml(h.results) : ''
        }${ballotsHtml(h.results)}</details>`;
      })
      .join('');
    const events = s.events
      .slice()
      .reverse()
      .map((e) => `<li>${e.round ? `<span class="muted small">R${e.round}</span> ` : ''}${esc(e.text)}</li>`)
      .join('');
    setHtml(
      $('history'),
      `<div class="grid-2">
        <div class="card"><h2>Past votes</h2>${votes || '<p class="muted">None yet.</p>'}</div>
        <div class="card"><h2>Game log</h2><ul class="plain history">${events || '<li class="muted">Nothing yet.</li>'}</ul></div>
      </div>`,
    );
  }

  // ------------------------------------------------------------------ events

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn || btn.disabled || !state) return;
    const id = btn.dataset.id;
    switch (btn.dataset.act) {
      case 'open-vote':
        return action('openVote', { kind: 'banish' }, 'Voting is open!');
      case 'open-endgame':
        if (!confirm('Open the Endgame vote? Everyone votes to END the game or BANISH again. It ends only if unanimous.')) return;
        return action('openVote', { kind: 'endgame' }, 'Endgame vote is open!');
      case 'close-vote':
        return action('closeVote', {}, 'Voting closed.');
      case 'cancel-vote':
        if (!confirm('Cancel this vote? All ballots will be thrown away.')) return;
        return action('cancelVote');
      case 'banish':
        if (!confirm(`Banish ${nameOf(id)}?`)) return;
        return action('banish', { playerId: id }, `${nameOf(id)} has been banished.`);
      case 'revote-tied':
        return action('revote', { candidates: state.vote.live.leaders.map((l) => l.id) }, 'Re-vote is open!');
      case 'revote-all':
        if (!confirm('Run the vote again with everyone on the ballot?')) return;
        return action('revote', { candidates: state.vote.candidates.map((c) => c.id) }, 'Re-vote is open!');
      case 'no-banish':
        if (!confirm('Finish this Round Table without banishing anyone?')) return;
        return action('noBanish');
      case 'resolve-endgame':
        return action('resolveEndgameVote');
      case 'night':
        return action('startNight', { mode: btn.dataset.mode }, 'Night has fallen.');
      case 'night-mode':
        return action('setNightMode', { mode: btn.dataset.mode });
      case 'murder':
        if (!confirm(`Confirm: the Traitors murder ${nameOf(id)}? (Revealed at breakfast.)`)) return;
        return action('endNight', { murderId: id }, 'Murder confirmed. Reveal it at breakfast.');
      case 'recruit':
        if (!confirm(`Send a recruitment offer to ${nameOf(id)}?`)) return;
        return action('sendRecruitOffer', { playerId: id }, 'Offer sent.');
      case 'no-murder':
        if (!confirm('End the night with nobody murdered?')) return;
        return action('endNight', { murderId: null });
      case 'reveal-breakfast':
        return action('revealBreakfast');
      case 'rename': {
        const name = prompt('New name:', nameOf(id));
        if (name) return action('renamePlayer', { playerId: id, name });
        return;
      }
      case 'remove':
        if (!confirm(`Remove ${nameOf(id)} from the game completely?`)) return;
        return action('removePlayer', { playerId: id });
      case 'reset-keep':
        if (!confirm('Start a new game with the same players? Roles and results will be cleared.')) return;
        return action('resetGame', { keepPlayers: true }, 'New game ready.');
      default:
    }
  });

  document.addEventListener('change', async (e) => {
    const el = e.target;
    if (!state) return;
    if (el.dataset.setting) {
      await action('updateSettings', { [el.dataset.setting]: el.checked }, 'Setting saved.');
    } else if (el.dataset.settingNum) {
      const value = Math.max(0, Math.min(3600, Math.round(Number(el.value) || 0)));
      await action('updateSettings', { [el.dataset.settingNum]: value }, 'Setting saved.');
    } else if (el.dataset.change === 'role') {
      await action('setRole', { playerId: el.dataset.id, role: el.value || null });
    } else if (el.dataset.change === 'status') {
      await action('setStatus', { playerId: el.dataset.id, status: el.value });
    } else if (el.dataset.change === 'shield') {
      await action('setShield', { playerId: el.dataset.id, value: el.checked });
    }
  });

  $('traitor-count').addEventListener('input', () => ($('traitor-count')._touched = true));
  $('assign-random').addEventListener('click', async () => {
    const count = Number($('traitor-count').value);
    const res = await action('assignRolesRandom', { count }, `Roles assigned: ${count} Traitor${count === 1 ? '' : 's'}.`);
    if (res) $('traitor-count')._touched = false;
  });
  $('start-game').addEventListener('click', () => {
    if (!confirm('Start the game? Every player will be able to see their secret role.')) return;
    action('startGame', {}, 'The game has begun!');
  });

  $('add-player').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('add-player-name').value;
    const res = await action('addPlayer', { name });
    if (res) {
      $('add-player-name').value = '';
      toast(`${res.name} added. Their rejoin code is ${res.code}.`, 'ok');
    }
  });

  $('announce-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await action('announce', { text: $('announce-text').value }, 'Announcement posted.');
    if (res) $('announce-text').value = '';
  });
  $('clear-announcement').addEventListener('click', () => action('clearAnnouncement'));

  $('end-game').addEventListener('click', () => {
    if (!confirm('End the game now and reveal every role?')) return;
    const winner = $('end-winner').value || undefined;
    action('endGame', winner ? { winner } : {}, 'Game over!');
  });
  $('reset-keep').addEventListener('click', () => {
    if (!confirm('Start a new game with the same players? Roles and results will be cleared.')) return;
    action('resetGame', { keepPlayers: true }, 'New game ready.');
  });
  $('reset-wipe').addEventListener('click', () => {
    if (!confirm('Wipe EVERYTHING, including all players? Everyone will need to join again.')) return;
    action('resetGame', { keepPlayers: false }, 'Everything wiped.');
  });

  $('logout').addEventListener('click', logout);

  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = $('login-password').value;
    try {
      await api('/api/admin/login', { method: 'POST', body: { password } });
      adminKey = password;
      storageSet(KEY, password);
      $('login-password').value = '';
      start();
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  if (adminKey) start();
  else logout();
})();
