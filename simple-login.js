// Simple login fix
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('usernameInput');
    
    function proceedToApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('entryPage').classList.remove('hidden');
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', proceedToApp);
    }
    
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                proceedToApp();
            }
        });
    }
});