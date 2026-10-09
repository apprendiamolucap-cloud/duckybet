// ===== PAPERE =====
// Minigioco: caccia alle papere

window.Papere = {

  active: false,
  score: 0,
  timeLeft: 30,
  spawnInterval: null,
  timerInterval: null,
  cost: 10,
  duration: 30,

  // Avvia il gioco
  start() {
    if (this.active) return;

    if (Balance.get() < this.cost) {
      Utils.showMessage('duckMessage', `⚠️ Ti servono €${this.cost} per giocare!`, 'lose');
      return;
    }

    // Scala il costo
    Balance.remove(this.cost);
    Balance.newBet();

    // Reset
    this.active = true;
    this.score = 0;
    this.timeLeft = this.duration;
    document.getElementById('duckScore').textContent = '0';
    document.getElementById('duckTime').textContent = this.duration + 's';
    document.getElementById('duckStartBtn').disabled = true;
    Utils.showMessage('duckMessage', '🎯 Clicca le papere!', '');

    // Pulisci papere vecchie
    document.querySelectorAll('.duck').forEach(d => d.remove());

    // Spawna papere
    this.spawnInterval = setInterval(() => this.spawn(), 700);

    // Timer
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      document.getElementById('duckTime').textContent = this.timeLeft + 's';
      if (this.timeLeft <= 0) this.end();
    }, 1000);
  },

  // Crea una papera
  spawn() {
    if (!this.active) return;
    const area = document.getElementById('duckArea');
    if (!area) return;

    const duck = document.createElement('div');
    duck.className = 'duck';
    
    // 15% di probabilità che sia dorata
    const isGolden = Math.random() < 0.15;
    if (isGolden) {
      duck.classList.add('golden');
      duck.dataset.points = 50;
    } else {
      duck.dataset.points = 10;
    }

    duck.textContent = isGolden ? '🦆' : '🦆';
    
    // Posizione casuale (evita i bordi)
    const maxX = area.offsetWidth - 60;
    const maxY = area.offsetHeight - 60;
    duck.style.left = Utils.randomInt(10, maxX) + 'px';
    duck.style.top = Utils.randomInt(10, maxY) + 'px';

    // Click handler
    duck.onclick = (e) => {
      e.stopPropagation();
      this.hit(duck);
    };

    area.appendChild(duck);

    // Auto-rimozione dopo qualche secondo (per evitare troppa densità)
    setTimeout(() => {
      if (duck.parentNode && !duck.classList.contains('hit')) {
        duck.remove();
      }
    }, 2500);
  },

  // Papera colpita
  hit(duck) {
    if (!this.active) return;
    const points = parseInt(duck.dataset.points) || 10;
    this.score += points;
    document.getElementById('duckScore').textContent = this.score;
    Balance.duckCaught();

    duck.classList.add('hit');
    setTimeout(() => duck.remove(), 400);
  },

  // Fine partita
  end() {
    this.active = false;
    clearInterval(this.spawnInterval);
    clearInterval(this.timerInterval);
    document.getElementById('duckStartBtn').disabled = false;

    // Rimuovi tutte le papere
    document.querySelectorAll('.duck').forEach(d => d.remove());

    // Converti punti in €
    const winnings = this.score;
    if (winnings > 0) {
      Balance.win(winnings);
      Utils.showMessage('duckMessage', 
        `🏆 ${this.score} punti = €${winnings}! Bel lavoro! 🎉`, 'win');
    } else {
      Utils.showMessage('duckMessage', 
        `😢 Nessuna papera catturata. Riprova!`, 'lose');
    }

    // Reset timer display
    document.getElementById('duckTime').textContent = this.duration + 's';
  }

};

console.log('✅ papere.js caricato');
