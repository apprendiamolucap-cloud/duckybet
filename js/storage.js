// ===== STORAGE =====
// Gestisce il salvataggio in localStorage

window.Storage = {

  KEY_STATE: 'duckybet_state',
  KEY_USER: 'duckybet_user',
  KEY_HALLOWEEN: 'duckybet_halloween_unlocked',

  defaultState: {
    balance: 100,
    totalWon: 0,
    betsWon: 0,
    betsTotal: 0,
    ducksCaught: 0
  },

  // ===== STATO =====
  saveState(state) {
    try {
      localStorage.setItem(this.KEY_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('Errore salvataggio stato:', e);
    }
  },

  loadState() {
    try {
      const saved = localStorage.getItem(this.KEY_STATE);
      if (saved) {
        return { ...this.defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Errore caricamento stato:', e);
    }
    return { ...this.defaultState };
  },

  // ===== UTENTE =====
  saveUser(user) {
    try {
      localStorage.setItem(this.KEY_USER, JSON.stringify(user));
    } catch (e) {}
  },

  loadUser() {
    try {
      const saved = localStorage.getItem(this.KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  removeUser() {
    localStorage.removeItem(this.KEY_USER);
  },

  // ===== HALLOWEEN =====
  isHalloweenUnlocked() {
    return localStorage.getItem(this.KEY_HALLOWEEN) === 'true';
  },

  unlockHalloween() {
    localStorage.setItem(this.KEY_HALLOWEEN, 'true');
  },

  // ===== RESET =====
  resetAll() {
    localStorage.removeItem(this.KEY_STATE);
    localStorage.removeItem(this.KEY_USER);
    localStorage.removeItem('duckybet_leaderboard');
    localStorage.removeItem('duckybet_codici_riscattati');
    localStorage.removeItem(this.KEY_HALLOWEEN);
  }

};

console.log('✅ storage.js caricato');
