// ===== UTILS =====
// Funzioni helper riutilizzabili

window.Utils = {

  // Formatta numero come prezzo: 1234 -> "1.234"
  formatMoney(n) {
    return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },

  // Numero intero casuale tra min e max (inclusi)
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Numero decimale casuale
  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  // Elemento casuale da array
  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Mostra messaggio con classe win/lose/info
  showMessage(elementId, text, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = text;
    el.className = 'message' + (type ? ' ' + type : '');
  },

  // Effetto pop
  celebrate(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.transition = 'transform 0.2s';
    el.style.transform = 'scale(1.15)';
    setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
  },

  // Delay con Promise
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Data formattata italiana
  formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('it-IT');
    } catch (e) {
      return '';
    }
  }

};

console.log('✅ utils.js caricato');
