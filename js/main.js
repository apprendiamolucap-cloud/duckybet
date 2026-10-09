document.addEventListener('DOMContentLoaded', () => {
    console.log('🦆 DuckyBet avviato!');
    
    const bottone = document.querySelector('button');
    let click = 0;
    
    bottone.addEventListener('click', () => {
        click++;
        bottone.textContent = `Cliccato ${click} volte!`;
    });
});
