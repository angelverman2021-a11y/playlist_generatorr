// Authentication handler
class AuthHandler {
    constructor() {
        this.isLoginMode = true;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.loginTitle = document.getElementById('loginTitle');
        this.usernameInput = document.getElementById('usernameInput');
        this.passwordInput = document.getElementById('passwordInput');
        this.emailInput = document.getElementById('emailInput');
        this.loginBtn = document.getElementById('loginBtn');
        this.registerBtn = document.getElementById('registerBtn');
        this.toggleText = document.getElementById('toggleText');
        this.toggleMode = document.getElementById('toggleMode');
    }

    bindEvents() {
        this.loginBtn.addEventListener('click', () => this.handleLogin());
        this.registerBtn.addEventListener('click', () => this.handleRegister());
        this.toggleMode.addEventListener('click', () => this.toggleAuthMode());
        
        // Enter key support
        [this.usernameInput, this.passwordInput, this.emailInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.isLoginMode ? this.handleLogin() : this.handleRegister();
                }
            });
        });
    }

    toggleAuthMode() {
        this.isLoginMode = !this.isLoginMode;
        
        if (this.isLoginMode) {
            // Switch to login mode
            this.loginTitle.textContent = 'Welcome Back, Music Explorer!';
            this.emailInput.style.display = 'none';
            this.loginBtn.style.display = 'block';
            this.registerBtn.style.display = 'none';
            this.toggleText.textContent = 'New user? ';
            this.toggleMode.textContent = 'Create Account';
        } else {
            // Switch to register mode
            this.loginTitle.textContent = 'Join the Lunar Community!';
            this.emailInput.style.display = 'block';
            this.loginBtn.style.display = 'none';
            this.registerBtn.style.display = 'block';
            this.toggleText.textContent = 'Already have an account? ';
            this.toggleMode.textContent = 'Login';
        }
        
        this.clearInputs();
    }

    handleLogin() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        if (!username || !password) {
            this.showMessage('Please enter both username and password', 'error');
            return;
        }

        const result = userDB.login(username, password);
        
        if (result.success) {
            this.showMessage('Login successful! Welcome back!', 'success');
            setTimeout(() => {
                this.proceedToApp(result.user);
            }, 1000);
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    handleRegister() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const email = this.emailInput.value.trim();

        if (!username || !password) {
            this.showMessage('Please enter username and password', 'error');
            return;
        }

        if (username.length < 3) {
            this.showMessage('Username must be at least 3 characters', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        const result = userDB.register(username, password, email);
        
        if (result.success) {
            this.showMessage('Account created successfully! Logging you in...', 'success');
            setTimeout(() => {
                const loginResult = userDB.login(username, password);
                this.proceedToApp(loginResult.user);
            }, 1000);
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    showMessage(message, type) {
        // Remove existing message
        const existingMsg = document.querySelector('.auth-message');
        if (existingMsg) existingMsg.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        
        this.loginTitle.parentNode.insertBefore(messageDiv, this.usernameInput);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    clearInputs() {
        this.usernameInput.value = '';
        this.passwordInput.value = '';
        this.emailInput.value = '';
    }

    proceedToApp(user) {
        // Store current user session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Hide login page and show entry page
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('entryPage').classList.remove('hidden');
        
        // Update UI with user info
        this.updateUIWithUser(user);
    }

    updateUIWithUser(user) {
        // Update header with user greeting
        const header = document.querySelector('.logo');
        if (header) {
            header.innerHTML = `🌙 Welcome, ${user.username}! 🎵`;
        }
    }
}

// Initialize auth handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthHandler();
});