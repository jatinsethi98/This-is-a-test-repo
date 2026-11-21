'use strict';

// Durable JSON persistence. Writes go to a temp file that is then renamed
// over the real file, so a crash mid-write never leaves a half-written state.
// The previous good copy is kept as state.json.bak and used as a fallback.

const fs = require('fs');
const path = require('path');

class Store {
  constructor(dataDir, { log = console } = {}) {
    this.dir = dataDir;
    this.file = path.join(dataDir, 'state.json');
    this.backup = this.file + '.bak';
    this.log = log;
    fs.mkdirSync(dataDir, { recursive: true });
  }

  readJson(file) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  load() {
    const main = this.readJson(this.file);
    if (main) return main;
    if (fs.existsSync(this.file)) {
      const broken = `${this.file}.corrupt-${Date.now()}`;
      try {
        fs.renameSync(this.file, broken);
        this.log.error(`[store] state.json was unreadable; moved it to ${broken}`);
      } catch {
        /* ignore */
      }
    }
    const bak = this.readJson(this.backup);
    if (bak) this.log.warn('[store] restored game from backup copy');
    return bak;
  }

  save(state) {
    try {
      const tmp = `${this.file}.${process.pid}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(state));
      if (fs.existsSync(this.file)) fs.copyFileSync(this.file, this.backup);
      fs.renameSync(tmp, this.file);
      return true;
    } catch (err) {
      // Never take the game down because the disk hiccupped; the game keeps running in memory.
      this.log.error('[store] failed to save game state:', err.message);
      return false;
    }
  }

  readAdminPassword() {
    const data = this.readJson(path.join(this.dir, 'admin.json'));
    return data && typeof data.password === 'string' && data.password ? data.password : null;
  }

  writeAdminPassword(password) {
    try {
      fs.writeFileSync(path.join(this.dir, 'admin.json'), JSON.stringify({ password }));
    } catch (err) {
      this.log.error('[store] failed to save admin password:', err.message);
    }
  }
}

module.exports = { Store };
