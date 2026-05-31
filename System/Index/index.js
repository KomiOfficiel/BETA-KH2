const loadingBar = document.querySelector('.loading-bar');
let progress = 0;

// Simuler une barre de chargement progressive
const loadingInterval = setInterval(() => {
    progress += Math.random() * 30;
    
    if (progress > 100) {
        progress = 100;
    }
    
    loadingBar.style.width = progress + '%';
    
    // Quand le chargement est terminé
    if (progress === 100) {
        clearInterval(loadingInterval);
        
        // Attendre 500ms puis rediriger
        setTimeout(() => {
            window.location.href = "Welcome.html";
        }, 500);
    }
}, 600);