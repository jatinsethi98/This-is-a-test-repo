'use strict';

(() => {
  const { esc, api, poll, roleLabel, PHASE_LABEL, eventCard, winnerBanner } = T;
  const $ = (id) => document.getElementById(id);

  function setHtml(el, html) {
    if (el._html !== html) {
      el.innerHTML = html;
      el._html = html;
    }
  }

  function qrFor(url) {
    try {
      const q = qrcode(0, 'M');
      q.addData(url);
      q.make();
      return q.createSvgTag({ cellSize: 6, margin: 2 });
    } catch {
      return '';
    }
  }

  function tally(r) {
    if (!r.tally) {
      return `<p class="center" style="font-size:32px">End the game: <strong>${r.end}</strong> · Banish again: <strong>${r.banish}</strong></p>
        <p class="center" style="font-size:28px">${r.unanimousEnd ? 'Unanimous — the game will end!' : 'Not unanimous — the game continues!'}</p>`;
    }
    const max = Math.max(1, ...r.tally.map((t) => t.count));
    const leaders = new Set(r.leaders.map((l) => l.id));
    return r.tally
      .map(
        (t) => `<div class="tally-row ${leaders.has(t.playerId) ? 'leader' : ''}"><div>${esc(t.name)}</div>
          <div><div class="bar" style="width:${(t.count / max) * 100}%"></div></div><div>${t.count}</div></div>`,
      )
      .join('');
  }

  function render(s) {
    $('phase').textContent = (s.round ? `Round ${s.round} · ` : '') + (PHASE_LABEL[s.phase] || s.phase);
    setHtml($('announcement'), s.announcement ? `<div class="announcement">📣 ${esc(s.announcement.text)}</div>` : '');
    const url = s.joinUrls[0] || location.origin + '/';
    let main = '';
    const joinBlock = `<div class="card join"><div class="qr">${qrFor(url)}</div>
      <div><div class="muted">Scan or go to</div><div class="url">${esc(url)}</div><div class="muted">on the same Wi-Fi</div></div></div>`;
    switch (s.phase) {
      case 'lobby':
        main = `${joinBlock}<p class="center" style="font-size:24px">${s.players.length} player${s.players.length === 1 ? ' has' : 's have'} joined</p>`;
        break;
      case 'day':
        main = `<div class="card">${eventCard(s.lastEvent) || '<div class="event"><div class="big">The castle awaits…</div></div>'}</div>`;
        break;
      case 'voting': {
        const v = s.vote;
        const pct = v.eligibleCount ? Math.round((v.votedCount / v.eligibleCount) * 100) : 0;
        main = `<div class="card center"><div class="event"><div class="big">${
          v.kind === 'endgame' ? 'The Endgame: end the game, or banish again?' : 'The Round Table — cast your votes'
        }</div></div>
          ${v.deadline ? `<div class="countdown" data-deadline="${v.deadline}">${T.countdownText(v.deadline)}</div>` : ''}
          <p style="font-size:26px">${v.votedCount} of ${v.eligibleCount} have voted</p>
          <div class="progress"><div style="width:${pct}%"></div></div></div>`;
        break;
      }
      case 'results': {
        const v = s.vote;
        main = v.results
          ? `<div class="card"><div class="event"><div class="big">The votes are in</div></div>${tally(v.results)}</div>`
          : '<div class="card"><div class="event"><div class="big">Voting has closed…</div><div class="muted">Reveal your votes one by one.</div></div></div>';
        break;
      }
      case 'night':
        main = '<div class="card"><div class="event"><div class="big">🌙 Night has fallen. The Traitors are gathering…</div></div></div>';
        break;
      case 'breakfast':
        main = '<div class="card"><div class="event"><div class="big">☕ Breakfast… who will walk through the door?</div></div></div>';
        break;
      case 'ended':
        main = winnerBanner(s.winner);
        break;
      default:
    }
    if (s.phase !== 'lobby' && s.joinOpen) main += joinBlock;
    setHtml($('main'), main);

    setHtml(
      $('players'),
      s.players
        .map((p) => {
          const out = p.status !== 'alive';
          return `<div class="pcard ${out ? 'out' : ''} ${p.role || ''}">
            <div class="${out ? 'out' : ''}">${esc(p.name)}</div>
            ${out ? `<div class="small muted">${esc(p.status)}</div>` : ''}
            ${p.role ? `<span class="badge ${p.role}">${roleLabel(p.role)}</span>` : ''}
          </div>`;
        })
        .join(''),
    );
  }

  poll(() => api('/api/screen'), {
    onData(data) {
      T.syncClock(data.serverNow);
      render(data);
    },
  });
})();
