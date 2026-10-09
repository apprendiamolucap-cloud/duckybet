// ===== AUTH =====
// Gestisce login/logout simulato con Google

window.Auth = {

  // Mostra la modale di login Google
  showModal() {
    document.getElementById('googleModal').classList.add('show');
    setTimeout(() => {
      document.getElementById('gEmail').focus();
    }, 100);
  },

  // Chiude la modale
  closeModal() {
    document.getElementById('googleModal').classList.remove('show');
  },

  // Conferma il login
  confirm() {
    const email = document.getElementById('gEmail').value.trim();
    const nameInput = document.getElementById('gName').value.trim();

    if (!email || !email.includes('@')) {
      alert('⚠️ Inserisci un\'email valida');
      return;
    }

    const name = nameInput || email.split('@')[0];
    const user = { email, name };

    // Salva utente
    Storage.saveUser(user);

    // Aggiorna UI
    this.updateUserUI(user);

    // Nascondi login, mostra app
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appContainer').style.display = 'block';

    // Chiudi modale
    this.closeModal();

    // Inizializza i giochi
    if (window.Main && window.Main.initGames) {
      window.Main.initGames();
    }
  },

  // Aggiorna nome e avatar nell'header
  updateUserUI(user) {
    document.getElementById('userName').textContent = user.name;
    const initial = user.name.charAt(0).toUpperCase();
    document.getElementById('userAvatar').innerHTML = 
      `<span style="background:#F5A623;color:#fff;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">${initial}</span>`;
  },

  // Logout
  logout() {
    if (!confirm('Vuoi uscire dal tuo account?')) return;
    Storage.removeUser();
    location.reload();
  },

  // Controlla se l'utente è già loggato all'avvio
  checkAuth() {
    const user = Storage.loadUser();
    if (user) {
      this.updateUserUI(user);
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('appContainer').style.display = 'block';
      return true;
    }
    return false;
  }

};

console.log('✅ auth.js caricato');
