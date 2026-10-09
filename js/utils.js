// ===== UTILS =====
// Funzioni helper riutilizzabili in tutto il sito

window.Utils = {

  // Formatta un numero come prezzo: 100 -> "100", 1234 -> "1.234"
  formatMoney(n) {
    return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },

  // Numero intero casuale tra min e max (inclusi)
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Numero decimale casuale tra min e max
  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  // Elemento casuale da un array
  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Mostra un messaggio in un elemento con classe win/lose
  showMessage(elementId, text, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = text;
    el.className = 'message' + (type ? ' ' + type : '');
  },

  // Effetto pop quando si vince (aggiunge classe temporanea)
  celebrate(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.transition = 'transform 0.2s';
    el.style.transform = 'scale(1.15)';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
    }, 200);
  },

  // Delay con Promise (per animazioni sequenziali)
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Emoji casuale per papere
  randomDuckEmoji() {
    const ducks = ['🦆', '🦆', '🦆', '🦆', '🦆', '🦢'];
    return this.randomFrom(ducks);
  }

};

console.log('✅ utils.js caricato');
