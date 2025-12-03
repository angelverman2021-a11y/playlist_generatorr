// Enhanced Login System with Password Visibility, Email Integration, and Forgot Password
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script loaded successfully!');
    // Elements
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const emailInput = document.getElementById('emailInput');
    const togglePassword = document.getElementById('togglePassword');
    const toggleMode = document.getElementById('toggleMode');
    const forgotToggle = document.getElementById('forgotToggle');
    const loginTitle = document.getElementById('loginTitle');
    const toggleText = document.getElementById('toggleText');

    let currentMode = 'login'; // 'login', 'register', 'forgot'
    let users = JSON.parse(localStorage.getItem('lunarUsers') || '{}');
    let verificationCodes = {};

    // Password visibility toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    // Mode switching
    if (toggleMode) {
        toggleMode.addEventListener('click', function() {
            if (currentMode === 'login') {
                switchToRegister();
            } else {
                switchToLogin();
            }
        });
    }

    if (forgotToggle) {
        forgotToggle.addEventListener('click', function() {
            switchToForgotPassword();
        });
    }

    // Login functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                showMessage('Please enter both username and password!', 'error');
                return;
            }

            if (users[username] && users[username].password === password) {
                showMessage('🌙 Welcome back, Lunar Explorer!', 'success');
                setTimeout(() => {
                    proceedToApp();
                }, 1500);
            } else {
                showMessage('Invalid cosmic credentials! Try again.', 'error');
            }
        });
    }

    // Register functionality
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const email = emailInput.value.trim();

            if (!username || !password || !email) {
                showMessage('Username, password, and email are required!', 'error');
                return;
            }

            if (users[username]) {
                showMessage('This cosmic explorer already exists!', 'error');
                return;
            }

            // Validate email
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address!', 'error');
                return;
            }

            // Create new user
            users[username] = {
                password: password,
                email: email,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('lunarUsers', JSON.stringify(users));
            showMessage('🌟 Lunar Explorer registered successfully!', 'success');
            
            setTimeout(() => {
                switchToLogin();
                usernameInput.value = username;
                passwordInput.value = '';
            }, 2000);
        });
    }

    // Forgot password functionality
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', function() {
            console.log('🔑 Forgot password button clicked!');
            const username = usernameInput.value.trim();
            console.log('👤 Username entered:', username);

            if (!username) {
                showMessage('Please enter your username first!', 'error');
                return;
            }

            console.log('📋 All users:', users);
            if (!users[username]) {
                showMessage('Cosmic explorer not found!', 'error');
                return;
            }

            console.log('👤 User found:', users[username]);
            if (!users[username].email) {
                showMessage('No email associated with this account!', 'error');
                return;
            }

            console.log('📧 User email:', users[username].email);
            
            // Generate verification code
            const verificationCode = generateVerificationCode();
            verificationCodes[username] = {
                code: verificationCode,
                expires: Date.now() + 300000 // 5 minutes
            };

            console.log('🔢 Generated code:', verificationCode);
            
            // Send email
            sendVerificationEmail(users[username].email, verificationCode);
            showVerificationModal(username);
        });
    }

    // Enter key support
    [usernameInput, passwordInput, emailInput].forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    if (currentMode === 'login') {
                        loginBtn.click();
                    } else if (currentMode === 'register') {
                        registerBtn.click();
                    } else if (currentMode === 'forgot') {
                        forgotPasswordBtn.click();
                    }
                }
            });
        }
    });

    // Helper functions
    function switchToLogin() {
        currentMode = 'login';
        loginTitle.textContent = 'Welcome Back, Lunar Explorer!';
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'none';
        forgotPasswordBtn.style.display = 'block';
        emailInput.style.display = 'none';
        emailInput.classList.add('hidden');
        toggleText.textContent = 'New lunar explorer? ';
        toggleMode.textContent = 'Join the Mission';
        document.querySelector('.forgot-toggle').style.display = 'block';
        clearInputs();
    }

    function switchToRegister() {
        currentMode = 'register';
        loginTitle.textContent = 'Join the Lunar Mission!';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'block';
        forgotPasswordBtn.style.display = 'none';
        emailInput.style.display = 'block';
        emailInput.classList.remove('hidden');
        toggleText.textContent = 'Already exploring? ';
        toggleMode.textContent = 'Return to Base';
        document.querySelector('.forgot-toggle').style.display = 'none';
        clearInputs();
    }

    function switchToForgotPassword() {
        currentMode = 'forgot';
        loginTitle.textContent = 'Recover Your Cosmic Key';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        forgotPasswordBtn.style.display = 'block';
        emailInput.style.display = 'none';
        emailInput.classList.add('hidden');
        toggleText.textContent = 'Remember your key? ';
        toggleMode.textContent = 'Return to Login';
        document.querySelector('.forgot-toggle').style.display = 'none';
        clearInputs();
    }

    function clearInputs() {
        usernameInput.value = '';
        passwordInput.value = '';
        emailInput.value = '';
        passwordInput.type = 'password';
        togglePassword.textContent = '👁️';
    }

    function showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;

        // Insert before login form
        const loginForm = document.querySelector('.login-form');
        loginForm.insertBefore(messageDiv, loginForm.firstChild);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function sendVerificationEmail(email, code) {
        console.log('🔍 DEBUG - Email received:', email);
        console.log('🔍 DEBUG - Email type:', typeof email);
        console.log('🔍 DEBUG - Email length:', email ? email.length : 'null/undefined');
        
        if (!email || email.trim() === '') {
            console.error('❌ Email is empty or null!');
            showMessage('❌ No email found for this user!', 'error');
            return;
        }
        
        // Show verification code on screen as backup
        console.log(`📧 Verification code for ${email}: ${code}`);
        showMessage(`🔑 Your verification code is: ${code}`, 'success');
        
        // Send real email using EmailJS
        if (typeof emailjs !== 'undefined') {
            console.log('🔄 Attempting to send email...');
            
            const templateParams = {
                to_email: email.trim(),
                to_name: 'Lunar Explorer',
                user_name: 'Lunar Explorer', 
                verification_code: code,
                from_name: 'Lunar Playlist Craft',
                reply_to: email.trim()
            };
            
            console.log('📤 Final template params:', JSON.stringify(templateParams, null, 2));
            
            emailjs.send('playlist_generator__', 'template_qmohhyg', templateParams)
                .then(function(response) {
                    console.log('✅ Email sent successfully!', response.status, response.text);
                    showMessage('📧 Email sent! Check your inbox.', 'success');
                })
                .catch(function(error) {
                    console.error('❌ EmailJS Error Details:', error);
                    showMessage('⚠️ Email service error. Code shown above.', 'error');
                });
        } else {
            console.log('❌ EmailJS not loaded');
        }
    }

    function showVerificationModal(username) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'verification-modal';
        modal.innerHTML = `
            <div class="verification-content">
                <h3>🔐 Enter Verification Code</h3>
                <p style="font-size: 8px; color: #666; margin-bottom: 15px;">
                    Check your email for the 6-digit code
                </p>
                <input type="text" id="verificationCode" class="verification-input" 
                       placeholder="Enter 6-digit code" maxlength="6">
                <div class="reset-form">
                    <h4>🆕 Set New Password</h4>
                    <input type="password" id="newPassword" class="verification-input" 
                           placeholder="Enter new password">
                    <input type="password" id="confirmPassword" class="verification-input" 
                           placeholder="Confirm new password">
                </div>
                <button id="verifyCode" class="verification-btn">🔓 RESET PASSWORD</button>
                <button id="cancelVerification" class="cancel-btn">❌ CANCEL</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle verification
        const verifyBtn = modal.querySelector('#verifyCode');
        const cancelBtn = modal.querySelector('#cancelVerification');
        const codeInput = modal.querySelector('#verificationCode');
        const newPasswordInput = modal.querySelector('#newPassword');
        const confirmPasswordInput = modal.querySelector('#confirmPassword');

        verifyBtn.addEventListener('click', function() {
            const enteredCode = codeInput.value.trim();
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!enteredCode || !newPassword || !confirmPassword) {
                alert('Please fill all fields!');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const storedVerification = verificationCodes[username];
            if (!storedVerification || Date.now() > storedVerification.expires) {
                alert('Verification code expired! Please try again.');
                modal.remove();
                return;
            }

            if (enteredCode === storedVerification.code) {
                // Update password
                users[username].password = newPassword;
                localStorage.setItem('lunarUsers', JSON.stringify(users));
                
                // Clean up
                delete verificationCodes[username];
                modal.remove();
                
                showMessage('🌟 Password reset successfully!', 'success');
                switchToLogin();
                usernameInput.value = username;
            } else {
                alert('Invalid verification code!');
            }
        });

        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });

        // Auto-focus on code input
        codeInput.focus();
    }

    function proceedToApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('entryPage').classList.remove('hidden');
    }

    // Initialize with login mode
    switchToLogin();
});