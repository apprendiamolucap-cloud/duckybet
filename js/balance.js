// ===== BALANCE =====
// Gestisce il saldo e le statistiche

window.Balance = {

  state: {
    balance: 100,
    totalWon: 0,
    betsWon: 0,
    betsTotal: 0,
    ducksCaught: 0
  },

  // Carica lo stato dal localStorage
  init() {
    this.state = Storage.loadState();
    this.updateUI();
  },

  // Ritorna il saldo corrente
  get() {
    return this.state.balance;
  },

  // Aggiunge soldi al saldo
  add(amount) {
    this.state.balance += amount;
    this.save();
    this.updateUI();
  },

  // Rimuove soldi (ritorna false se non basta)
  remove(amount) {
    if (this.state.balance < amount) return false;
    this.state.balance -= amount;
    this.save();
    this.updateUI();
    return true;
  },

  // Registra una vincita
  win(amount) {
    this.state.balance += amount;
    this.state.totalWon += amount;
    this.state.betsWon++;
    this.save();
    this.updateUI();
    if (window.Utils) Utils.celebrate('balance');
  },

  // Registra una scommessa (persa)
  lose() {
    this.save();
    this.updateUI();
  },

  // Incrementa contatore scommesse totali
  newBet() {
    this.state.betsTotal++;
    this.save();
  },

  // Incrementa papere catturate
  duckCaught() {
    this.state.ducksCaught++;
    this.save();
  },

  // Salva su localStorage
  save() {
    Storage.saveState(this.state);
  },

  // Aggiorna l'interfaccia
  updateUI() {
    const fmt = window.Utils ? Utils.formatMoney : (n) => Math.floor(n);
    document.getElementById('balance').textContent = fmt(this.state.balance);
    document.getElementById('totalWon').textContent = fmt(this.state.totalWon);
    document.getElementById('betsWon').textContent = this.state.betsWon;
    document.getElementById('betsTotal').textContent = this.state.betsTotal;
    document.getElementById('ducksCaught').textContent = this.state.ducksCaught;
  },

  // Reset totale
  reset() {
    if (!confirm('Sei sicuro? Perderai tutti i progressi!')) return;
    Storage.resetAll();
    location.reload();
  }

};

console.log('✅ balance.js caricato');
