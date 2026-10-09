// ===== MAIN =====
// Avvio app + gestione tab

window.Main = {

  initialized: false,

  // Avvia tutto
  async init() {
    console.log('🦆 DuckyBet avviato');

    // 1. Carica saldo dal localStorage
    Balance.init();

    // 2. Controlla se già loggato
    const isLoggedIn = Auth.checkAuth();

    // 3. Se loggato, carica i giochi
    if (isLoggedIn) {
      await this.initGames();
    }
  },

  // Inizializza i moduli dei giochi
  async initGames() {
    if (this.initialized) return;
    this.initialized = true;

    await Calcio.init();
    await Cavalli.init();
    // Papere è "lazy" — si attiva solo al click su INIZIA

    console.log('✅ Giochi inizializzati');
  }

};

// ===== TAB SWITCHING =====
function switchTab(tab, btn) {
  // Rimuovi active da tutti
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Attiva quello scelto
  const section = document.getElementById(tab + '-section');
  if (section) section.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ===== START =====
document.addEventListener('DOMContentLoaded', () => {
  Main.init();
});
