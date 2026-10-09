// ===== CALCIO =====
// Gestisce le schedine di calcio

window.Calcio = {

  matches: [],
  selected: {}, // { matchId: { pick: '1'|'X'|'2', odds: number, teams: 'A vs B' } }

  // Inizializza caricando le partite
  async init() {
    try {
      const res = await fetch('data/matches.json');
      const data = await res.json();
      this.matches = data.matches;
    } catch (e) {
      console.warn('Errore caricamento partite, uso dati interni');
      // Fallback: dati inline se fetch non funziona
      this.matches = [
        { id:1, league:"Serie A", time:"20:45", home:"Inter", away:"Milan", odds:{"1":2.1,"X":3.2,"2":3.5} },
        { id:2, league:"Premier League", time:"18:30", home:"Liverpool", away:"Arsenal", odds:{"1":2.3,"X":3.4,"2":2.9} },
        { id:3, league:"Champions", time:"21:00", home:"Real Madrid", away:"Bayern", odds:{"1":2.5,"X":3.3,"2":2.7} },
        { id:4, league:"La Liga", time:"19:00", home:"Barcelona", away:"Atletico", odds:{"1":1.9,"X":3.5,"2":3.8} },
        { id:5, league:"Serie A", time:"18:00", home:"Juventus", away:"Napoli", odds:{"1":2.4,"X":3.1,"2":3.0} },
        { id:6, league:"Bundesliga", time:"15:30", home:"Dortmund", away:"Leverkusen", odds:{"1":2.8,"X":3.4,"2":2.4} }
      ];
    }
    this.render();
  },

  // Renderizza la lista partite
  render() {
    const list = document.getElementById('matchList');
    if (!list) return;
    list.innerHTML = '';

    this.matches.forEach(m => {
      const card = document.createElement('div');
      card.className = 'match-card';
      card.innerHTML = `
        <div class="match-header">
          <span class="league">${m.league}</span>
          <span class="match-time">🕐 ${m.time}</span>
        </div>
        <div class="teams">
          <span class="team">${m.home}</span>
          <span class="vs">VS</span>
          <span class="team">${m.away}</span>
        </div>
        <div class="odds">
          <button class="odd-btn ${this.isSelected(m.id,'1')?'selected':''}" 
                  onclick="Calcio.select(${m.id}, '1', ${m.odds['1']}, '${m.home} vs ${m.away}')">
            <span class="odd-label">1 (Casa)</span>
            <span class="odd-value">${m.odds['1'].toFixed(2)}</span>
          </button>
          <button class="odd-btn ${this.isSelected(m.id,'X')?'selected':''}" 
                  onclick="Calcio.select(${m.id}, 'X', ${m.odds['X']}, '${m.home} vs ${m.away}')">
            <span class="odd-label">X (Pareggio)</span>
            <span class="odd-value">${m.odds['X'].toFixed(2)}</span>
          </button>
          <button class="odd-btn ${this.isSelected(m.id,'2')?'selected':''}" 
                  onclick="Calcio.select(${m.id}, '2', ${m.odds['2']}, '${m.home} vs ${m.away}')">
            <span class="odd-label">2 (Trasferta)</span>
            <span class="odd-value">${m.odds['2'].toFixed(2)}</span>
          </button>
        </div>
      `;
      list.appendChild(card);
    });
  },

  // Verifica se una giocata è già selezionata
  isSelected(matchId, pick) {
    return this.selected[matchId] && this.selected[matchId].pick === pick;
  },

  // Seleziona una giocata
  select(matchId, pick, odds, teams) {
    if (this.selected[matchId] && this.selected[matchId].pick === pick) {
      // Deseleziona
      delete this.selected[matchId];
    } else {
      this.selected[matchId] = { pick, odds, teams };
    }
    this.render();
    this.updateMessage();
  },

  // Aggiorna il messaggio con riepilogo
  updateMessage() {
    const count = Object.keys(this.selected).length;
    if (count === 0) {
      Utils.showMessage('calcioMessage', 'Seleziona una o più giocate.', '');
      return;
    }
    const totalOdds = this.calculateTotalOdds();
    Utils.showMessage('calcioMessage', 
      `📋 ${count} giocata/e • Quota totale: ${totalOdds.toFixed(2)}x`, 
      '');
  },

  // Calcola la quota totale (prodotto di tutte le quote)
  calculateTotalOdds() {
    let total = 1;
    for (const id in this.selected) {
      total *= this.selected[id].odds;
    }
    return total;
  },

  // Gioca la schedina
  play() {
    const count = Object.keys(this.selected).length;
    if (count === 0) {
      Utils.showMessage('calcioMessage', '⚠️ Seleziona almeno una giocata!', 'lose');
      return;
    }

    const cost = count * 5; // €5 per giocata
    if (Balance.get() < cost) {
      Utils.showMessage('calcioMessage', 
        `⚠️ Saldo insufficiente! Ti servono €${cost}`, 'lose');
      return;
    }

    // Scala il costo
    Balance.remove(cost);
    Balance.newBet();

    // Simula esito: più giocate = più difficile
    const winProbability = Math.max(0.15, 0.7 - (count - 1) * 0.12);
    const totalOdds = this.calculateTotalOdds();

    Utils.showMessage('calcioMessage', '🎰 Calcolo risultati...', '');

    setTimeout(() => {
      if (Math.random() < winProbability) {
        const winAmount = Math.floor(cost * totalOdds);
        Balance.win(winAmount);
        Utils.showMessage('calcioMessage', 
          `🎉 HAI VINTO €${winAmount}! (quota ${totalOdds.toFixed(2)}x)`, 'win');
      } else {
        Balance.lose();
        Utils.showMessage('calcioMessage', 
          `😢 Schedina persa. Riprova!`, 'lose');
      }

      // Reset selezione
      this.selected = {};
      this.render();
    }, 1200);
  }

};

console.log('✅ calcio.js caricato');
