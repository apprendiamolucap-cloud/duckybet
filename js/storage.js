// ===== STORAGE =====
// Gestisce il salvataggio dei dati nel browser (localStorage)

window.Storage = {

  KEY_STATE: 'duckybet_state',
  KEY_USER: 'duckybet_user',

  // Stato di default (prima volta che si gioca)
  defaultState: {
    balance: 100,
    totalWon: 0,
    betsWon: 0,
    betsTotal: 0,
    ducksCaught: 0
  },

  // Salva lo stato corrente
  saveState(state) {
    try {
      localStorage.setItem(this.KEY_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('Impossibile salvare lo stato:', e);
    }
  },

  // Carica lo stato salvato (o default se non esiste)
  loadState() {
    try {
      const saved = localStorage.getItem(this.KEY_STATE);
      if (saved) {
        return { ...this.defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Impossibile caricare lo stato:', e);
    }
    return { ...this.defaultState };
  },

  // Salva l'utente loggato
  saveUser(user) {
    try {
      localStorage.setItem(this.KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Impossibile salvare utente:', e);
    }
  },

  // Carica l'utente loggato (o null)
  loadUser() {
    try {
      const saved = localStorage.getItem(this.KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  // Rimuove l'utente (logout)
  removeUser() {
    localStorage.removeItem(this.KEY_USER);
  },

  // Reset completo (per pulsante reset)
  resetAll() {
    localStorage.removeItem(this.KEY_STATE);
    localStorage.removeItem(this.KEY_USER);
  }

};

console.log('✅ storage.js caricato');
