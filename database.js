// Simple client-side database using localStorage
class UserDatabase {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = null;
    }

    // Load users from localStorage
    loadUsers() {
        const stored = localStorage.getItem('lunarPlaylistUsers');
        return stored ? JSON.parse(stored) : {};
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('lunarPlaylistUsers', JSON.stringify(this.users));
    }

    // Register new user
    register(username, password, email = '') {
        if (this.users[username]) {
            return { success: false, message: 'Username already exists' };
        }

        this.users[username] = {
            password: this.hashPassword(password),
            email: email,
            createdAt: new Date().toISOString(),
            playlists: [],
            preferences: {
                favoriteGenres: [],
                favoriteMoods: [],
                totalPlaylistsCreated: 0
            },
            loginHistory: []
        };

        this.saveUsers();
        return { success: true, message: 'User registered successfully' };
    }

    // Login user
    login(username, password) {
        const user = this.users[username];
        if (!user || user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid username or password' };
        }

        this.currentUser = username;
        user.loginHistory.push({
            timestamp: new Date().toISOString(),
            ip: 'localhost'
        });
        this.saveUsers();

        return { success: true, message: 'Login successful', user: this.getUserData(username) };
    }

    // Simple password hashing (for demo - use proper hashing in production)
    hashPassword(password) {
        return btoa(password + 'lunarSalt123');
    }

    // Get user data (without password)
    getUserData(username) {
        const user = this.users[username];
        if (!user) return null;

        return {
            username: username,
            email: user.email,
            createdAt: user.createdAt,
            playlists: user.playlists,
            preferences: user.preferences,
            loginCount: user.loginHistory.length
        };
    }

    // Save playlist for user
    savePlaylist(username, playlist) {
        if (!this.users[username]) return false;

        this.users[username].playlists.push({
            ...playlist,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });

        this.users[username].preferences.totalPlaylistsCreated++;
        this.saveUsers();
        return true;
    }

    // Get user playlists
    getUserPlaylists(username) {
        return this.users[username]?.playlists || [];
    }

    // Update user preferences
    updatePreferences(username, preferences) {
        if (!this.users[username]) return false;

        this.users[username].preferences = {
            ...this.users[username].preferences,
            ...preferences
        };
        this.saveUsers();
        return true;
    }

    // Logout current user
    logout() {
        this.currentUser = null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser ? this.getUserData(this.currentUser) : null;
    }
}

// Initialize database
const userDB = new UserDatabase();