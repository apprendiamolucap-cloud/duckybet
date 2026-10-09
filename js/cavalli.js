// ===== CAVALLI =====
// Gestisce le corse dei cavalli

window.Cavalli = {

  horses: [],
  selectedId: null,
  racing: false,

  // Inizializza caricando i cavalli
  async init() {
    try {
      const res = await fetch('data/horses.json');
      const data = await res.json();
      this.horses = data.horses;
    } catch (e) {
      console.warn('Errore caricamento cavalli, uso dati interni');
      this.horses = [
        { id:1, name:"Fulmine", emoji:"🏇", odds:2.5 },
        { id:2, name:"Tuono", emoji:"🐎", odds:3.0 },
        { id:3, name:"Lampo", emoji:"🏇", odds:4.0 },
        { id:4, name:"Vento", emoji:"🐎", odds:5.5 },
        { id:5, name:"Saetta", emoji:"🏇", odds:8.0 }
      ];
    }
    this.render();
  },

  // Renderizza pista + selettore
  render() {
    const track = document.getElementById('raceTrack');
    const picker = document.getElementById('horsePicker');
    if (!track || !picker) return;

    // Pista (mantieni finish-line)
    track.innerHTML = '<div class="finish-line"></div>';
    this.horses.forEach((h, i) => {
      const lane = document.createElement('div');
      lane.className = 'lane';
      lane.innerHTML = `
        <span class="lane-num">${i + 1}</span>
        <span class="horse" id="horse-${h.id}" style="left:50px;">${h.emoji}</span>
      `;
      track.appendChild(lane);
    });

    // Selettore
    picker.innerHTML = '';
    this.horses.forEach(h => {
      const opt = document.createElement('div');
      opt.className = 'horse-option' + (this.selectedId === h.id ? ' selected' : '');
      opt.onclick = () => this.select(h.id);
      opt.innerHTML = `
        <span class="h-emoji">${h.emoji}</span>
        <div class="h-name">${h.name}</div>
        <div class="h-odds">x${h.odds.toFixed(1)}</div>
      `;
      picker.appendChild(opt);
    });
  },

  // Seleziona un cavallo
  select(id) {
    if (this.racing) return;
    this.selectedId = id;
    this.render();
    const h = this.horses.find(x => x.id === id);
    Utils.showMessage('raceMessage', `🐎 Hai scelto: ${h.name} (x${h.odds})`, '');
  },

  // Avvia la corsa
  async start() {
    if (this.racing) return;
    if (!this.selectedId) {
      Utils.showMessage('raceMessage', '⚠️ Scegli prima un cavallo!', 'lose');
      return;
    }

    const bet = parseInt(document.getElementById('horseBet').value) || 0;
    if (bet <= 0) {
      Utils.showMessage('raceMessage', '⚠️ Puntata non valida!', 'lose');
      return;
    }
    if (Balance.get() < bet) {
      Utils.showMessage('raceMessage', '⚠️ Saldo insufficiente!', 'lose');
      return;
    }

    // Scala la puntata
    Balance.remove(bet);
    Balance.newBet();

    this.racing = true;
    document.getElementById('raceBtn').disabled = true;
    Utils.showMessage('raceMessage', '🏁 E via...!', '');

    // Reset posizioni
    this.horses.forEach(h => {
      const el = document.getElementById('horse-' + h.id);
      if (el) {
        el.style.left = '50px';
        el.classList.remove('winner');
      }
    });

    // Corsa: ogni cavallo ha velocità basata sulle quote
    // Quote basse = più veloce (più probabile vinca)
    const finishPos = 100; // percentuale
    const laneWidth = document.getElementById('raceTrack').offsetWidth - 120;

    const positions = {};
    this.horses.forEach(h => positions[h.id] = 50);

    const speeds = {};
    this.horses.forEach(h => {
      // Velocità base: più alta per quote basse
      const baseSpeed = 15 / h.odds; // 2.5 -> 6, 8.0 -> 1.875
      // Aggiungi un po' di casualità
      speeds[h.id] = baseSpeed * (0.7 + Math.random() * 0.6);
    });

    // Animazione con setInterval
    const tick = 50; // ms
    const interval = setInterval(() => {
      let winner = null;

      this.horses.forEach(h => {
        // Variazione casuale per ogni tick
        const increment = speeds[h.id] * (0.5 + Math.random()) * (tick / 100);
        positions[h.id] += increment;

        const el = document.getElementById('horse-' + h.id);
        if (el) {
          const pct = Math.min(positions[h.id], laneWidth);
          el.style.left = (50 + pct) + 'px';
        }

        if (positions[h.id] >= laneWidth && !winner) {
          winner = h;
        }
      });

      if (winner) {
        clearInterval(interval);
        this.finishRace(winner, bet);
      }
    }, tick);
  },

  // Fine corsa
  finishRace(winner, bet) {
    const winnerEl = document.getElementById('horse-' + winner.id);
    if (winnerEl) winnerEl.classList.add('winner');

    const playerWon = this.selectedId === winner.id;

    setTimeout(() => {
      if (playerWon) {
        const winAmount = Math.floor(bet * winner.odds);
        Balance.win(winAmount);
        Utils.showMessage('raceMessage', 
          `🏆 ${winner.name} ha vinto! Hai vinto €${winAmount}! 🎉`, 'win');
      } else {
        const myHorse = this.horses.find(h => h.id === this.selectedId);
        Balance.lose();
        Utils.showMessage('raceMessage', 
          `😢 ${winner.name} ha vinto. Il tuo ${myHorse.name} è arrivato dopo. Riprova!`, 'lose');
      }

      this.racing = false;
      document.getElementById('raceBtn').disabled = false;
    }, 800);
  }

};

console.log('✅ cavalli.js caricato');
