// ===== LEADERBOARD =====
// Classifica dei migliori giocatori (salvata localmente)

window.Leaderboard = {

  KEY: 'duckybet_leaderboard',

  // Carica la classifica
  load() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Salva la classifica
  save(list) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Errore salvataggio classifica:', e);
    }
  },

  // Aggiunge un nuovo record
  addRecord(playerName, gameType, points, money) {
    const list = this.load();

    // Cerca se il player esiste già per quel gioco
    const existing = list.find(r => 
      r.player.toLowerCase() === playerName.toLowerCase() && r.game === gameType
    );

    if (existing) {
      // Aggiorna solo se il nuovo punteggio è migliore
      if (points > existing.points) {
        existing.points = points;
        existing.money = money;
        existing.date = new Date().toISOString();
      }
    } else {
      // Nuovo record
      list.push({
        player: playerName,
        game: gameType,
        points: points,
        money: money,
        date: new Date().toISOString()
      });
    }

    // Ordina per punti (decrescente)
    list.sort((a, b) => b.points - a.points);

    // Tieni solo i top 50
    const trimmed = list.slice(0, 50);

    this.save(trimmed);
    this.render();
    return trimmed;
  },

  // Renderizza la classifica
  render() {
    const container = document.getElementById('leaderboardContent');
    if (!container) return;

    const list = this.load();
    const filterGame = document.getElementById('lbFilter')?.value || 'all';

    let filtered = list;
    if (filterGame !== 'all') {
      filtered = list.filter(r => r.game === filterGame);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:30px;color:#888;font-style:italic;">
          🏆 Nessun record ancora. Gioca per entrare in classifica!
        </div>
      `;
      return;
    }

    // Medaglie per i primi 3
    const medals = ['🥇', '🥈', '🥉'];

    let html = '<div style="display:flex;flex-direction:column;gap:8px;">';
    filtered.forEach((r, i) => {
      const medal = i < 3 ? medals[i] : `<span style="display:inline-block;width:24px;text-align:center;color:#888;font-weight:700;">#${i+1}</span>`;
      const dateStr = new Date(r.date).toLocaleDateString('it-IT');
      const gameIcon = { calcio: '⚽', cavalli: '🐎', papere: '🦆' }[r.game] || '🎮';
      
      html += `
        <div style="background:#fff;border:3px solid #FFD93D;border-radius:15px;padding:12px 15px;display:flex;align-items:center;gap:12px;${i<3?'box-shadow:0 4px 0 #E8B923;':''}">
          <span style="font-size:22px;">${medal}</span>
          <div style="flex:1;">
            <div style="font-weight:700;color:#333;font-size:14px;">${r.player}</div>
            <div style="font-size:11px;color:#888;">${gameIcon} ${r.game} • ${dateStr}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700;color:#F5A623;font-size:16px;">${r.points} pt</div>
            <div style="font-size:11px;color:#4CAF50;">€${r.money}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  },

  // Reset classifica (solo admin)
  reset() {
    if (!confirm('⚠️ Cancellare TUTTA la classifica? Azione irreversibile!')) return;
    localStorage.removeItem(this.KEY);
    this.render();
  }

};

console.log('✅ leaderboard.js caricato');
