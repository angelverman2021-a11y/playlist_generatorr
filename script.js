const songDatabase = {
    happy: {
        pop: ['Happy - Pharrell Williams', 'Good as Hell - Lizzo', 'Uptown Funk - Bruno Mars'],
        rock: ['Don\'t Stop Me Now - Queen', 'Walking on Sunshine - Katrina'],
        'hip-hop': ['Good Life - Kanye West', 'I Gotta Feeling - Black Eyed Peas'],
        electronic: ['Levels - Avicii', 'Titanium - David Guetta'],
        jazz: ['Feeling Good - Nina Simone', 'What a Wonderful World - Louis Armstrong'],
        classical: ['Ode to Joy - Beethoven', 'Spring - Vivaldi'],
        indie: ['Electric Feel - MGMT', 'Young Folks - Peter Bjorn'],
        bollywood: ['Jai Ho - A.R. Rahman', 'Nagada Sang Dhol - Shreya Ghoshal']
    },
    chill: {
        pop: ['Stay - Rihanna', 'Breathe Me - Sia'],
        rock: ['Wish You Were Here - Pink Floyd', 'Black - Pearl Jam'],
        'hip-hop': ['Nujabes - Aruarian Dance', 'Stan - Eminem'],
        electronic: ['Porcelain - Moby', 'Teardrop - Massive Attack'],
        jazz: ['Blue in Green - Miles Davis', 'Autumn Leaves - Bill Evans'],
        classical: ['Clair de Lune - Debussy', 'Gymnopédie No.1 - Satie'],
        indie: ['Holocene - Bon Iver', 'Flightless Bird - Iron & Wine'],
        bollywood: ['Kun Faya Kun - A.R. Rahman', 'Tum Hi Ho - Arijit Singh']
    },
    energetic: {
        pop: ['Stronger - Kelly Clarkson', 'Roar - Katy Perry'],
        rock: ['Eye of the Tiger - Survivor', 'We Will Rock You - Queen'],
        'hip-hop': ['Till I Collapse - Eminem', 'POWER - Kanye West'],
        electronic: ['Bangarang - Skrillex', 'Clarity - Zedd'],
        jazz: ['Sing Sing Sing - Benny Goodman', 'Take Five - Dave Brubeck'],
        classical: ['1812 Overture - Tchaikovsky', 'Ride of the Valkyries - Wagner'],
        indie: ['Pumped Up Kicks - Foster the People', 'Take a Slice - Glass Animals'],
        bollywood: ['Malhari - Vishal-Shekhar', 'Tattad Tattad - Sanjay Leela Bhansali']
    },
    sad: {
        pop: ['Someone Like You - Adele', 'Hello - Adele'],
        rock: ['Hurt - Nine Inch Nails', 'Mad World - Tears for Fears'],
        'hip-hop': ['Stan - Eminem', 'Hurt Me Soul - Lupe Fiasco'],
        electronic: ['Sad Machine - Porter Robinson', 'Language - Porter Robinson'],
        jazz: ['Strange Fruit - Billie Holiday', 'Gloomy Sunday - Billie Holiday'],
        classical: ['Adagio for Strings - Barber', 'Lacrimosa - Mozart'],
        indie: ['Hurt - Johnny Cash', 'Mad World - Gary Jules'],
        bollywood: ['Ae Dil Hai Mushkil - Arijit Singh', 'Hamari Adhuri Kahani - Arijit Singh']
    },
    romantic: {
        pop: ['Perfect - Ed Sheeran', 'All of Me - John Legend'],
        rock: ['More Than Words - Extreme', 'Every Rose Has Its Thorn - Poison'],
        'hip-hop': ['Best Part - Daniel Caesar', 'Golden - Jill Scott'],
        electronic: ['Something About Us - Daft Punk', 'Digital Love - Daft Punk'],
        jazz: ['At Last - Etta James', 'The Way You Look Tonight - Frank Sinatra'],
        classical: ['Canon in D - Pachelbel', 'Ave Maria - Schubert'],
        indie: ['First Time Ever I Saw Your Face - Roberta Flack', 'Make You Feel My Love - Bob Dylan'],
        bollywood: ['Tere Bina - A.R. Rahman', 'Gerua - Arijit Singh']
    },
    focus: {
        pop: ['Weightless - Marconi Union', 'Clair de Lune - Flight Facilities'],
        rock: ['Marooned - Pink Floyd', 'Orion - Metallica'],
        'hip-hop': ['Nujabes - Luv(sic)', 'J Dilla - Life'],
        electronic: ['Strobe - Deadmau5', 'Xtal - Aphex Twin'],
        jazz: ['Kind of Blue - Miles Davis', 'Take Five - Dave Brubeck'],
        classical: ['Goldberg Variations - Bach', 'Gymnopédie No.1 - Satie'],
        indie: ['Holocene - Bon Iver', 'Re: Stacks - Bon Iver'],
        bollywood: ['Raga Yaman - Pandit Ravi Shankar', 'Vande Mataram - A.R. Rahman']
    }
};

const aiRecommendations = {
    happy: ['Try adding modern hits for extra energy!', 'Mix in some classic feel-good songs!'],
    chill: ['Perfect for relaxation and study sessions!', 'Add some lo-fi beats for ultimate chill!'],
    energetic: ['Great for workouts and motivation!', 'Add some EDM for extra energy!'],
    sad: ['Perfect for emotional moments', 'Try some acoustic versions for deeper feels'],
    romantic: ['Great for date nights!', 'Add some jazz standards for elegance'],
    focus: ['Ideal for productivity and concentration', 'Try adding some ambient sounds']
};

let currentMusic = null;
let currentPlaylist = [];
let currentUser = null;
let userMoodHistory = [];
let savedPlaylists = [];
let spotifyAccessToken = null;

// Spotify Configuration
const SPOTIFY_CLIENT_ID = 'your_spotify_client_id'; // Replace with your Spotify Client ID
const SPOTIFY_REDIRECT_URI = window.location.origin + window.location.pathname;
const SPOTIFY_SCOPES = 'playlist-modify-public playlist-modify-private';

// User Management Functions
function loginUser() {
    const username = document.getElementById('usernameInput').value.trim();
    if (!username) {
        alert('Please enter a username!');
        return;
    }
    
    currentUser = username;
    
    // Load user data
    const userData = JSON.parse(localStorage.getItem(`user_${username}`)) || {
        playlists: [],
        moodHistory: [],
        lastMood: null,
        joinDate: new Date().toISOString()
    };
    
    savedPlaylists = userData.playlists;
    userMoodHistory = userData.moodHistory;
    
    // Hide login page and show entry page
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('entryPage').classList.remove('hidden');
    
    // Initialize entry page after login
    initEntryPage();
    
    console.log(`User ${username} logged in`);
}

function saveUserData() {
    if (!currentUser) return;
    
    const userData = {
        playlists: savedPlaylists,
        moodHistory: userMoodHistory,
        lastMood: userMoodHistory.length > 0 ? userMoodHistory[userMoodHistory.length - 1] : null,
        joinDate: JSON.parse(localStorage.getItem(`user_${currentUser}`))?.joinDate || new Date().toISOString()
    };
    
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));
}

function addMoodToHistory(mood, context = '') {
    if (!currentUser) return;
    
    const moodEntry = {
        mood: mood,
        context: context,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
    };
    
    userMoodHistory.push(moodEntry);
    
    // Keep only last 20 mood entries
    if (userMoodHistory.length > 20) {
        userMoodHistory = userMoodHistory.slice(-20);
    }
    
    saveUserData();
}

// Spotify Integration Functions
function connectToSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${SPOTIFY_CLIENT_ID}&` +
        `response_type=token&` +
        `redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&` +
        `scope=${encodeURIComponent(SPOTIFY_SCOPES)}`;
    
    window.location.href = authUrl;
}

function handleSpotifyCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
        spotifyAccessToken = accessToken;
        localStorage.setItem('spotify_access_token', accessToken);
        
        // Clear the hash from URL
        window.location.hash = '';
        
        alert('✅ Connected to Spotify successfully!');
        return true;
    }
    return false;
}

function checkSpotifyConnection() {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
        spotifyAccessToken = token;
        return true;
    }
    return false;
}

async function searchSpotifyTrack(songTitle) {
    if (!spotifyAccessToken) return null;
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songTitle)}&type=track&limit=1`, {
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.tracks && data.tracks.items.length > 0) {
            return data.tracks.items[0];
        }
    } catch (error) {
        console.error('Error searching Spotify:', error);
    }
    
    return null;
}

async function createSpotifyPlaylist() {
    if (!spotifyAccessToken) {
        if (confirm('You need to connect to Spotify first. Connect now?')) {
            connectToSpotify();
        }
        return;
    }
    
    const playlistName = document.getElementById('playlistNameInput').value.trim() || 
                        `${document.getElementById('mood').value.toUpperCase()} ${document.getElementById('genre').value.toUpperCase()} MIX`;
    
    const songs = [];
    document.querySelectorAll('.song-item').forEach(item => {
        const titleElement = item.querySelector('.song-title');
        let title = titleElement.textContent;
        
        // Remove song number and AI badge
        title = title.replace(/^\d+\.\s*/, '').replace(/🤖 AI$/, '').trim();
        songs.push(title);
    });
    
    if (songs.length === 0) {
        alert('No songs to export!');
        return;
    }
    
    try {
        // Get user profile
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`
            }
        });
        
        const userData = await userResponse.json();
        
        // Create playlist
        const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                description: `Created with Lunar Playlist Craft 🌙 - ${document.getElementById('mood').value} mood playlist`,
                public: false
            })
        });
        
        const playlist = await playlistResponse.json();
        
        // Search for tracks and add to playlist
        const trackUris = [];
        let foundCount = 0;
        
        for (const song of songs) {
            const track = await searchSpotifyTrack(song);
            if (track) {
                trackUris.push(track.uri);
                foundCount++;
            }
        }
        
        if (trackUris.length > 0) {
            // Add tracks to playlist
            await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${spotifyAccessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uris: trackUris
                })
            });
            
            alert(`🎵 Playlist "${playlistName}" created on Spotify!\n${foundCount}/${songs.length} songs found and added.`);
        } else {
            alert('❌ No matching songs found on Spotify.');
        }
        
    } catch (error) {
        console.error('Spotify API Error:', error);
        if (error.message.includes('401')) {
            localStorage.removeItem('spotify_access_token');
            spotifyAccessToken = null;
            alert('Spotify session expired. Please reconnect.');
        } else {
            alert('Error creating Spotify playlist. Please try again.');
        }
    }
}

function generatePlaylist() {
    const mood = document.getElementById('mood').value;
    const genre = document.getElementById('genre').value;
    const duration = parseInt(document.getElementById('duration').value);
    
    const songs = songDatabase[mood][genre] || [];
    const songsNeeded = Math.ceil(duration / 4);
    
    let playlist = [];
    for (let i = 0; i < songsNeeded; i++) {
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        const songDuration = Math.floor(Math.random() * 3) + 3;
        playlist.push({
            title: randomSong,
            duration: `${songDuration}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        });
    }
    
    displayPlaylist(playlist, mood, genre, duration);
}

function displayPlaylist(playlist, mood, genre, duration) {
    const playlistResult = document.getElementById('playlistResult');
    const playlistName = document.getElementById('playlistName');
    const playlistDuration = document.getElementById('playlistDuration');
    const songList = document.getElementById('songList');
    
    playlistName.textContent = `${mood.toUpperCase()} ${genre.toUpperCase()} MIX`;
    playlistDuration.textContent = `${duration} MIN`;
    
    songList.innerHTML = '';
    playlist.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.dataset.index = index;
        songItem.innerHTML = `
            <div>
                <div class="song-title">${index + 1}. ${song.title}</div>
            </div>
            <div class="song-controls">
                <select class="category-selector" onchange="changeSongCategory(${index}, this.value)">
                    <option value="main">🎵 Main</option>
                    <option value="favorite">⭐ Favorite</option>
                    <option value="skip">⏭️ Skip Later</option>
                    <option value="remove">🗑️ Remove</option>
                </select>
                <span class="song-duration">${song.duration}</span>
                <button class="remove-btn" onclick="removeSong(${index})" title="Remove Song">❌</button>
            </div>
        `;
        songList.appendChild(songItem);
    });
    
    generateAIRecommendations(mood, genre);
    
    playlistResult.classList.remove('hidden');
    playlistResult.scrollIntoView({ behavior: 'smooth' });
}

function createNewPlaylist() {
    document.getElementById('playlistResult').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateAIRecommendations(mood, genre) {
    const aiSuggestions = document.getElementById('aiSuggestions');
    const userInput = document.getElementById('aiInput').value;
    
    aiSuggestions.innerHTML = '<div class="loading">🤖 AI ANALYZING YOUR TASTE...</div>';
    
    setTimeout(() => {
        aiSuggestions.innerHTML = '';
        
        let recommendations = aiRecommendations[mood] || [];
        
        if (userInput.trim()) {
            recommendations.unshift(`Based on "${userInput}", I suggest exploring similar artists and themes!`);
        }
        
        recommendations.forEach(rec => {
            const suggestion = document.createElement('div');
            suggestion.className = 'ai-suggestion';
            suggestion.innerHTML = `<div class="ai-suggestion-text">${rec}</div>`;
            aiSuggestions.appendChild(suggestion);
        });
    }, 1500);
}

function getMoreSongs() {
    const mood = document.getElementById('mood').value;
    const genre = document.getElementById('genre').value;
    const aiSuggestions = document.getElementById('aiSuggestions');
    
    aiSuggestions.innerHTML = '<div class="loading">🧠 FINDING MORE GEMS...</div>';
    
    setTimeout(() => {
        const moreSongs = [
            `🎵 "${genre}" artists similar to your taste: Check out related playlists!`,
            `🎯 For ${mood} mood: Try exploring sub-genres and remixes!`,
            `🌟 Trending now: Mix in some viral TikTok songs for freshness!`
        ];
        
        aiSuggestions.innerHTML = '';
        moreSongs.forEach(song => {
            const suggestion = document.createElement('div');
            suggestion.className = 'ai-suggestion';
            suggestion.innerHTML = `<div class="ai-suggestion-text">${song}</div>`;
            aiSuggestions.appendChild(suggestion);
        });
    }, 1000);
}

function addAIRecommendedSongs() {
    const mood = document.getElementById('mood').value;
    const genre = document.getElementById('genre').value;
    const aiSuggestions = document.getElementById('aiSuggestions');
    
    aiSuggestions.innerHTML = '<div class="loading">🤖 AI FINDING SONG RECOMMENDATIONS...</div>';
    
    setTimeout(() => {
        const songs = songDatabase[mood][genre] || [];
        const recommendedSongs = [];
        
        const numRecommendations = Math.floor(Math.random() * 3) + 5;
        for (let i = 0; i < numRecommendations; i++) {
            const randomSong = songs[Math.floor(Math.random() * songs.length)];
            const songDuration = Math.floor(Math.random() * 3) + 3;
            recommendedSongs.push({
                title: randomSong,
                duration: `${songDuration}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
            });
        }
        
        aiSuggestions.innerHTML = `
            <div class="ai-recommendation-header">
                <h4>🎵 AI Recommended Songs for ${mood} ${genre}:</h4>
            </div>
            <div class="ai-song-recommendations">
                ${recommendedSongs.map((song, index) => `
                    <div class="ai-song-option" data-song-index="${index}">
                        <div class="ai-song-info">
                            <span class="ai-song-title">${song.title}</span>
                            <span class="ai-song-duration">${song.duration}</span>
                        </div>
                        <button class="add-song-btn" onclick="addSpecificSong('${song.title.replace(/'/g, "\\'").replace(/"/g, '\\"')}', '${song.duration}')">🎵 CRAFT</button>
                    </div>
                `).join('')}
            </div>
            <div class="ai-actions">
                <button class="ai-btn craft-all-btn" onclick="addAllRecommendedSongs()">⚒️ CRAFT ALL SONGS</button>
                <button class="ai-btn refresh-btn" onclick="getMoreSongs()">🔄 NEW GEMS</button>
            </div>
        `;
        
    }, 1500);
}

function addSpecificSong(songTitle, songDuration) {
    const songList = document.getElementById('songList');
    const currentSongCount = document.querySelectorAll('.song-item').length;
    
    const songItem = document.createElement('div');
    songItem.className = 'song-item ai-recommended';
    songItem.dataset.index = currentSongCount;
    songItem.innerHTML = `
        <div>
            <div class="song-title">${currentSongCount + 1}. ${songTitle} <span class="ai-badge">🤖 AI</span></div>
        </div>
        <div class="song-controls">
            <select class="category-selector" onchange="changeSongCategory(${currentSongCount}, this.value)">
                <option value="main">🎵 Main</option>
                <option value="favorite">⭐ Favorite</option>
                <option value="skip">⏭️ Skip Later</option>
                <option value="remove">🗑️ Remove</option>
            </select>
            <span class="song-duration">${songDuration}</span>
            <button class="remove-btn" onclick="removeSong(${currentSongCount})" title="Remove Song">❌</button>
        </div>
    `;
    songList.appendChild(songItem);
    
    songItem.style.animation = 'slideIn 0.5s ease-out';
    
    const songOptions = document.querySelectorAll('.ai-song-option');
    songOptions.forEach(option => {
        if (option.querySelector('.ai-song-title').textContent === songTitle) {
            option.style.opacity = '0.5';
            option.querySelector('.add-song-btn').textContent = '✨ CRAFTED';
            option.querySelector('.add-song-btn').disabled = true;
        }
    });
}

function addAllRecommendedSongs() {
    const songOptions = document.querySelectorAll('.ai-song-option');
    songOptions.forEach(option => {
        const addBtn = option.querySelector('.add-song-btn');
        if (!addBtn.disabled) {
            addBtn.click();
        }
    });
}

// AI Chatbot Functions
function openAIChat() {
    const modal = document.getElementById('aiChatModal');
    const chatMessages = document.getElementById('chatMessages');
    
    modal.classList.remove('hidden');
    
    if (chatMessages.children.length === 0) {
        let greeting = `Hello ${currentUser}! 🌙 I\'m Luna AI, your personal music curator.`;
        
        // Add personalized greeting based on mood history
        if (userMoodHistory.length > 0) {
            const lastMood = userMoodHistory[userMoodHistory.length - 1];
            const moodCount = userMoodHistory.filter(m => m.mood === lastMood.mood).length;
            greeting += ` I remember your last mood was ${lastMood.mood}. `;
            
            if (moodCount > 3) {
                greeting += `I\'ve noticed you\'ve been feeling ${lastMood.mood} quite often lately. `;
            }
        }
        
        greeting += 'Tell me how you\'re feeling today or what kind of music you want!';
        addChatMessage('ai', greeting);
    }
}

function closeAIChat() {
    document.getElementById('aiChatModal').classList.add('hidden');
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    if (sender === 'ai') {
        messageDiv.innerHTML = `<div class="message-content"><span class="ai-icon">🤖</span> ${message}</div>`;
    } else {
        messageDiv.innerHTML = `<div class="message-content"><span class="user-icon">👤</span> ${message}</div>`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const userMessage = chatInput.value.trim();
    
    if (!userMessage) return;
    
    addChatMessage('user', userMessage);
    chatInput.value = '';
    
    setTimeout(() => {
        const aiResponse = generateAIResponse(userMessage);
        addChatMessage('ai', aiResponse.message);
        
        if (aiResponse.playlist) {
            // Add mood to history
            addMoodToHistory(aiResponse.playlist.mood, `AI chat: ${userMessage}`);
            
            setTimeout(() => {
                // Set the form values
                document.getElementById('mood').value = aiResponse.playlist.mood;
                document.getElementById('genre').value = aiResponse.playlist.genre;
                document.getElementById('duration').value = aiResponse.playlist.duration;
                
                // Generate the playlist automatically
                generatePlaylist();
                
                // Close chat and show playlist
                setTimeout(() => {
                    closeAIChat();
                    document.getElementById('playlistResult').scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }, 1000);
        }
    }, 1000);
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return {
            message: 'Hey there! 👋 I\'m Luna, your personal music curator! I can read your vibe and craft the perfect playlist. What\'s your mood like right now?',
            playlist: null
        };
    }
    
    // Question responses
    if (message.includes('how are you') || message.includes('what\'s up')) {
        return {
            message: 'I\'m doing great, thanks for asking! 🌙 I\'ve been listening to the cosmic frequencies and I\'m ready to help you discover some amazing music. What brings you here today?',
            playlist: null
        };
    }
    
    if (message.includes('who are you') || message.includes('what are you')) {
        return {
            message: 'I\'m Luna AI, your mystical music companion! 🌙✨ I specialize in reading emotions and crafting personalized playlists that match your soul\'s frequency. Think of me as your musical fortune teller!',
            playlist: null
        };
    }
    
    // Enhanced mood detection with options
    if (message.includes('sad') || message.includes('depressed') || message.includes('down') || message.includes('crying') || message.includes('heartbreak')) {
        return {
            message: 'I can feel the weight in your words 😔 I understand you\'re going through a tough time. What kind of music would help you right now?\n\n🎵 Type "sad playlist" - if you want to embrace and process these feelings\n✨ Type "motivational playlist" - if you want something to lift your spirits\n🌙 Type "calm playlist" - if you want something peaceful to soothe your mind',
            playlist: null
        };
    }
    
    // Specific playlist requests
    if (message.includes('sad playlist') || message.includes('melancholy playlist')) {
        return {
            message: 'I understand. Sometimes we need music that honors our pain and helps us process these deep emotions. Creating your healing sad playlist now... 💙',
            playlist: { mood: 'sad', genre: 'indie', duration: '90' }
        };
    }
    
    if (message.includes('motivational playlist') || message.includes('uplifting playlist') || message.includes('inspiring playlist')) {
        return {
            message: 'Yes! Let\'s turn this around with some powerful, uplifting music that will remind you of your strength! Creating your motivational playlist now... 💪✨',
            playlist: { mood: 'happy', genre: 'pop', duration: '60' }
        };
    }
    
    if (message.includes('calm playlist') || message.includes('peaceful playlist') || message.includes('soothing playlist')) {
        return {
            message: 'Perfect choice. Let me create something gentle and soothing to bring peace to your mind and heart. Creating your calming playlist now... 🕯️',
            playlist: { mood: 'chill', genre: 'classical', duration: '120' }
        };
    }
    
    if (message.includes('happy') || message.includes('excited') || message.includes('good') || message.includes('great') || message.includes('amazing') || message.includes('fantastic')) {
        return {
            message: 'Your positive energy is radiating through the screen! ✨ I can feel your good vibes! What kind of happy playlist would amplify this feeling?\n\n🎉 Type "party playlist" - for high-energy celebration music\n🎵 Type "feel good playlist" - for uplifting, positive vibes\n💃 Type "dance playlist" - for music that makes you move',
            playlist: null
        };
    }
    
    if (message.includes('party playlist') || message.includes('celebration playlist')) {
        return {
            message: 'Party mode activated! 🎉 Let\'s create something that will make you and everyone around you dance! Creating your party playlist now... 💃',
            playlist: { mood: 'energetic', genre: 'electronic', duration: '90' }
        };
    }
    
    if (message.includes('feel good playlist') || message.includes('positive playlist')) {
        return {
            message: 'Yes! Let\'s amplify those beautiful positive vibes with some feel-good music! Creating your uplifting playlist now... ✨',
            playlist: { mood: 'happy', genre: 'pop', duration: '60' }
        };
    }
    
    if (message.includes('dance playlist') || message.includes('dancing playlist')) {
        return {
            message: 'Time to move those feet! 💃 Creating a playlist that will make your body groove to every beat! Creating your dance playlist now... 🎶',
            playlist: { mood: 'energetic', genre: 'pop', duration: '75' }
        };
    }
    
    if (message.includes('tired') || message.includes('exhausted') || message.includes('sleepy') || message.includes('drained')) {
        return {
            message: 'You sound like you need some restoration 🌙 What would help you recharge right now?\n\n💤 Type "sleep playlist" - for gentle music to help you rest\n⚡ Type "energy playlist" - for music to wake you up and energize you\n🕯️ Type "relaxing playlist" - for peaceful music to restore your mind',
            playlist: null
        };
    }
    
    if (message.includes('sleep playlist') || message.includes('bedtime playlist')) {
        return {
            message: 'Sweet dreams await 🌙 Creating the perfect lullaby playlist to guide you into peaceful sleep... 💤',
            playlist: { mood: 'chill', genre: 'classical', duration: '120' }
        };
    }
    
    if (message.includes('energy playlist') || message.includes('wake up playlist')) {
        return {
            message: 'Time to wake up and seize the day! ⚡ Creating an energizing playlist to get your blood pumping... 💪',
            playlist: { mood: 'energetic', genre: 'pop', duration: '60' }
        };
    }
    
    if (message.includes('relaxing playlist') || message.includes('restoration playlist')) {
        return {
            message: 'Perfect for gentle restoration 🕯️ Creating a peaceful playlist to restore your weary soul... 🌿',
            playlist: { mood: 'chill', genre: 'jazz', duration: '90' }
        };
    }
    
    if (message.includes('stressed') || message.includes('anxious') || message.includes('overwhelmed') || message.includes('panic')) {
        return {
            message: 'I can sense the tension you\'re carrying 🙏 Take a deep breath with me... What kind of music would help you right now?\n\n🕯️ Type "calming playlist" - for peaceful music to slow your thoughts\n🎵 Type "meditation playlist" - for deep, mindful relaxation\n🌿 Type "nature playlist" - for soothing, natural sounds',
            playlist: null
        };
    }
    
    if (message.includes('calming playlist') || message.includes('stress relief playlist')) {
        return {
            message: 'Let\'s slow down those racing thoughts together 🕯️ Creating your calming playlist now... 🌙',
            playlist: { mood: 'chill', genre: 'jazz', duration: '90' }
        };
    }
    
    if (message.includes('meditation playlist') || message.includes('mindful playlist')) {
        return {
            message: 'Time for deep, mindful relaxation 🧘 Creating your meditation playlist now... 🕯️',
            playlist: { mood: 'focus', genre: 'classical', duration: '120' }
        };
    }
    
    if (message.includes('angry') || message.includes('mad') || message.includes('frustrated') || message.includes('pissed')) {
        return {
            message: 'I feel that fire in your words! 🔥 How do you want to channel this energy?\n\n🤘 Type "rock playlist" - for intense music that matches your fire\n🕯️ Type "calming playlist" - for peaceful music to cool down\n💪 Type "workout playlist" - to channel anger into physical energy',
            playlist: null
        };
    }
    
    if (message.includes('rock playlist') || message.includes('intense playlist')) {
        return {
            message: 'Let\'s channel that fire into pure rock power! 🤘 Creating your intense rock playlist now... 🔥',
            playlist: { mood: 'energetic', genre: 'rock', duration: '60' }
        };
    }
    
    // Activity-based responses
    if (message.includes('workout') || message.includes('gym') || message.includes('exercise') || message.includes('running')) {
        return {
            message: 'Time to unleash your inner warrior! 💪 What kind of workout energy do you need?\n\n⚡ Type "high energy playlist" - for intense cardio and HIIT\n🎵 Type "steady workout playlist" - for consistent gym sessions\n🏃 Type "running playlist" - perfect for jogging and running',
            playlist: null
        };
    }
    
    if (message.includes('high energy playlist') || message.includes('intense workout playlist')) {
        return {
            message: 'Maximum intensity mode activated! ⚡ Creating your high-energy beast mode playlist now... 💪',
            playlist: { mood: 'energetic', genre: 'electronic', duration: '60' }
        };
    }
    
    if (message.includes('steady workout playlist') || message.includes('gym playlist')) {
        return {
            message: 'Perfect for crushing your gym session! 🏋️ Creating your steady workout playlist now... 💪',
            playlist: { mood: 'energetic', genre: 'rock', duration: '75' }
        };
    }
    
    if (message.includes('running playlist') || message.includes('jogging playlist')) {
        return {
            message: 'Let\'s get those feet moving! 🏃 Creating your perfect running rhythm playlist now... 🎵',
            playlist: { mood: 'energetic', genre: 'pop', duration: '60' }
        };
    }
    
    if (message.includes('workout playlist')) {
        return {
            message: 'Ready to dominate your workout! 💪 Creating your ultimate workout playlist now... ⚡',
            playlist: { mood: 'energetic', genre: 'electronic', duration: '60' }
        };
    }
    
    if (message.includes('study') || message.includes('homework') || message.includes('work') || message.includes('focus')) {
        return {
            message: 'Ah, time to enter the zone! 🔮 I\'ll create a sonic environment that sharpens your mind like a blade. Crafting your focus playlist now... 🧠',
            playlist: { mood: 'focus', genre: 'classical', duration: '120' }
        };
    }
    
    if (message.includes('party') || message.includes('dance') || message.includes('club') || message.includes('friends')) {
        return {
            message: 'Party mode activated! 🎉 I can already see you moving to the beat! Creating your dance floor destroyer playlist... 💃',
            playlist: { mood: 'energetic', genre: 'electronic', duration: '90' }
        };
    }
    
    if (message.includes('date') || message.includes('romantic') || message.includes('love') || message.includes('valentine')) {
        return {
            message: 'Love is in the air! 💕 I can sense the butterflies in your stomach. Weaving your romantic playlist now... 💝',
            playlist: { mood: 'romantic', genre: 'jazz', duration: '120' }
        };
    }
    
    // Genre preferences with personality
    if (message.includes('rock') || message.includes('metal') || message.includes('guitar')) {
        return {
            message: 'A fellow rock soul! 🤘 I can hear the electric guitars calling your name. Time to unleash some serious sonic power!',
            playlist: { mood: 'energetic', genre: 'rock', duration: '75' }
        };
    }
    
    if (message.includes('jazz') || message.includes('smooth') || message.includes('saxophone')) {
        return {
            message: 'Ah, you have sophisticated taste! 🎷 Jazz is like liquid gold for the soul. Let me pour you something smooth and intoxicating.',
            playlist: { mood: 'chill', genre: 'jazz', duration: '90' }
        };
    }
    
    if (message.includes('classical') || message.includes('orchestra') || message.includes('piano')) {
        return {
            message: 'A connoisseur of the timeless arts! 🎹 Classical music is pure emotion translated into sound. Let me select some pieces that will touch your very soul.',
            playlist: { mood: 'focus', genre: 'classical', duration: '120' }
        };
    }
    
    // Conversational responses
    if (message.includes('thank') || message.includes('thanks')) {
        return {
            message: 'You\'re so welcome! 🌙 It brings me joy to help you discover music that resonates with your spirit. Music is meant to be shared and celebrated!',
            playlist: null
        };
    }
    
    if (message.includes('help') || message.includes('what can you do')) {
        return {
            message: 'I\'m here to be your musical guide! ✨ Just tell me how you\'re feeling, what you\'re doing, or what kind of vibe you want. I\'ll read between the lines and craft the perfect playlist for your soul. Try saying things like "I\'m feeling nostalgic" or "I need energy" or "surprise me!"',
            playlist: null
        };
    }
    
    if (message.includes('surprise') || message.includes('random') || message.includes('anything')) {
        const surprises = [
            { message: 'Ooh, I love surprises! 🎲 I\'m sensing... indie vibes! Something dreamy and ethereal to transport you to another dimension.', playlist: { mood: 'chill', genre: 'indie', duration: '75' } },
            { message: 'Mystery playlist incoming! 🔮 I\'m feeling some electronic magic - something that will make you feel like you\'re floating through space!', playlist: { mood: 'chill', genre: 'electronic', duration: '60' } },
            { message: 'Surprise mode activated! ✨ How about some Bollywood magic? Trust me, these rhythms will awaken something beautiful in your soul!', playlist: { mood: 'happy', genre: 'bollywood', duration: '90' } }
        ];
        return surprises[Math.floor(Math.random() * surprises.length)];
    }
    
    // Intelligent default responses
    const contextualDefaults = [
        'I\'m listening to the vibrations of your words... 🌙 Tell me more about what\'s in your heart right now. Are you seeking energy, peace, nostalgia, or something else entirely?',
        'Your message is like a musical note to me, but I need a few more to create the perfect harmony 🎵 What\'s your soul craving today?',
        'I can sense there\'s a story behind your words ✨ Share a bit more about your mood or what you\'re hoping to feel, and I\'ll craft something magical for you.',
        'Every person has a unique musical fingerprint 🔮 Help me discover yours! What emotions are flowing through you right now?'
    ];
    
    return {
        message: contextualDefaults[Math.floor(Math.random() * contextualDefaults.length)],
        playlist: null
    };
}

function savePlaylist() {
    if (!currentUser) {
        alert('Please login to save playlists!');
        return;
    }
    
    const nameInput = document.getElementById('playlistNameInput');
    const playlistName = nameInput.value.trim() || `Playlist ${new Date().toLocaleDateString()}`;
    const mood = document.getElementById('mood').value;
    const genre = document.getElementById('genre').value;
    
    const songs = [];
    document.querySelectorAll('.song-item').forEach(item => {
        const title = item.querySelector('.song-title').textContent;
        const duration = item.querySelector('.song-duration').textContent;
        songs.push({ title, duration });
    });
    
    const playlist = {
        id: Date.now(),
        name: playlistName,
        mood,
        genre,
        songs,
        createdAt: new Date().toLocaleString(),
        user: currentUser
    };
    
    savedPlaylists.push(playlist);
    addMoodToHistory(mood, `Created playlist: ${playlistName}`);
    saveUserData();
    
    nameInput.value = '';
    alert(`✅ Playlist "${playlistName}" saved!`);
}

function viewSavedPlaylists() {
    const modal = document.getElementById('savedPlaylistsModal');
    const list = document.getElementById('savedPlaylistsList');
    
    list.innerHTML = '';
    
    if (savedPlaylists.length === 0) {
        list.innerHTML = '<div class="no-playlists">No saved playlists yet!</div>';
    } else {
        savedPlaylists.forEach(playlist => {
            const item = document.createElement('div');
            item.className = 'saved-playlist-item';
            item.innerHTML = `
                <div class="saved-playlist-info">
                    <div class="saved-playlist-name">${playlist.name}</div>
                    <div class="saved-playlist-details">${playlist.mood} • ${playlist.genre} • ${playlist.songs.length} songs • ${playlist.createdAt}</div>
                </div>
                <div>
                    <button class="load-btn" onclick="loadPlaylist(${playlist.id})">📂 LOAD</button>
                    <button class="delete-btn" onclick="deletePlaylist(${playlist.id})">🗑️ DELETE</button>
                </div>
            `;
            list.appendChild(item);
        });
    }
    
    modal.classList.remove('hidden');
}

function loadPlaylist(id) {
    const playlist = savedPlaylists.find(p => p.id === id);
    if (playlist) {
        document.getElementById('mood').value = playlist.mood;
        document.getElementById('genre').value = playlist.genre;
        
        displayPlaylist(playlist.songs, playlist.mood, playlist.genre, playlist.songs.length * 4);
        closeSavedPlaylists();
    }
}

function deletePlaylist(id) {
    if (confirm('Are you sure you want to delete this playlist?')) {
        savedPlaylists = savedPlaylists.filter(p => p.id !== id);
        saveUserData();
        viewSavedPlaylists();
    }
}

function closeSavedPlaylists() {
    document.getElementById('savedPlaylistsModal').classList.add('hidden');
}

function removeSong(index) {
    const songItem = document.querySelector(`[data-index="${index}"]`);
    if (songItem) {
        songItem.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            songItem.remove();
            updateSongNumbers();
        }, 300);
    }
}

function changeSongCategory(index, category) {
    const songItem = document.querySelector(`[data-index="${index}"]`);
    if (songItem) {
        songItem.classList.remove('favorite', 'skip', 'remove');
        if (category !== 'main') {
            songItem.classList.add(category);
        }
        
        if (category === 'remove') {
            setTimeout(() => removeSong(index), 500);
        }
    }
}

function updateSongNumbers() {
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
        const titleElement = item.querySelector('.song-title');
        const currentTitle = titleElement.textContent;
        const newTitle = currentTitle.replace(/^\d+\./, `${index + 1}.`);
        titleElement.textContent = newTitle;
        item.dataset.index = index;
    });
}

function initBackgroundMusic() {
    switchMusic('phonk');
}

let audioContext;
let currentOscillator;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

let currentMelodyIndex = 0;
let melodyInterval;

function switchMusic(type) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    
    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator = null;
    }
    
    if (melodyInterval) {
        clearInterval(melodyInterval);
    }
    
    initAudioContext();
    
    // Minecraft "Sweden" melody notes (C418)
    const minecraftMelody = [523.25, 659.25, 783.99, 659.25, 523.25, 392.00, 523.25, 392.00];
    
    const musicSettings = {
        'cute': { type: 'sine', volume: 0.025, speed: 800 },
        'peace': { type: 'sine', volume: 0.02, speed: 1200 },
        'phonk': { type: 'sawtooth', volume: 0.035, speed: 600 },
        'lofi': { type: 'triangle', volume: 0.03, speed: 1000 },
        'synthwave': { type: 'square', volume: 0.028, speed: 700 },
        'trap': { type: 'sawtooth', volume: 0.04, speed: 500 },
        'girlypop': { type: 'sine', volume: 0.022, speed: 650 }
    };
    
    const settings = musicSettings[type];
    if (settings && audioContext) {
        currentMelodyIndex = 0;
        
        function playNextNote() {
            try {
                if (currentOscillator) {
                    currentOscillator.stop();
                }
                
                currentOscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                currentOscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const freq = minecraftMelody[currentMelodyIndex];
                currentOscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                currentOscillator.type = settings.type;
                
                gainNode.gain.setValueAtTime(settings.volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
                
                currentOscillator.start();
                currentOscillator.stop(audioContext.currentTime + 0.5);
                
                currentMelodyIndex = (currentMelodyIndex + 1) % minecraftMelody.length;
            } catch (error) {
                console.log('Audio error:', error);
            }
        }
        
        playNextNote();
        melodyInterval = setInterval(playNextNote, settings.speed);
        console.log(`Minecraft ${type} theme started`);
    }
}

function toggleMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const musicSelector = document.getElementById('musicSelector');
    
    if (musicToggle) {
        if (currentOscillator || melodyInterval) {
            if (currentOscillator) {
                currentOscillator.stop();
                currentOscillator = null;
            }
            if (melodyInterval) {
                clearInterval(melodyInterval);
                melodyInterval = null;
            }
            musicToggle.textContent = '🔇';
        } else {
            const selectedType = musicSelector ? musicSelector.value : 'phonk';
            switchMusic(selectedType);
            musicToggle.textContent = '🎵';
        }
    }
}

function adjustVolume() {
    const volumeSlider = document.getElementById('volumeSlider');
    
    if (volumeSlider && audioContext && currentOscillator) {
        const volume = volumeSlider.value / 100 * 0.05;
        const gainNodes = audioContext.destination.context.createGain();
        // Volume adjustment for Web Audio API would need more complex setup
        console.log(`Volume set to ${volumeSlider.value}%`);
    }
}

function changeMusicType() {
    const musicSelector = document.getElementById('musicSelector');
    if (musicSelector) {
        switchMusic(musicSelector.value);
    }
}

function createRandomSticker() {
    const stickers = ['🌌', '🔥', '🌧️', '💜', '🔮', '🧱', '💎', '🎵', '🎶', '✨', '❤️', '💖', '💕', '⭐', '🌟', '💫', '🎭', '🎨', '🎪', '🎯'];
    const container = document.querySelector('.floating-stickers');
    
    if (container) {
        const sticker = document.createElement('div');
        sticker.className = 'sticker dynamic';
        sticker.innerHTML = stickers[Math.floor(Math.random() * stickers.length)];
        sticker.style.left = Math.random() * 100 + '%';
        sticker.style.fontSize = (48 + Math.random() * 32) + 'px';
        sticker.style.animationDuration = (6 + Math.random() * 10) + 's';
        sticker.style.animationDelay = Math.random() * 1 + 's';
        sticker.style.fontFamily = "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
        sticker.style.textRendering = 'optimizeQuality';
        
        container.appendChild(sticker);
        
        setTimeout(() => {
            if (sticker.parentNode) {
                sticker.parentNode.removeChild(sticker);
            }
        }, 20000);
    }
}

function createStickerBurst() {
    for (let i = 0; i < 2; i++) {
        setTimeout(createRandomSticker, i * 300);
    }
}

function highlightMoodStickers(mood) {
    // Placeholder function for mood highlighting
}

function initEntryPage() {
    const entryPage = document.getElementById('entryPage');
    const mainContent = document.getElementById('mainContent');
    const letters = document.querySelectorAll('.letter');
    const letterSound = document.getElementById('letterSound');
    const charmSound = document.getElementById('charmSound');
    
    // Only initialize if entry page is visible
    if (entryPage.classList.contains('hidden')) return;
    
    setTimeout(() => {
        charmSound.volume = 0.4;
        charmSound.play().catch(() => {});
    }, 300);
    
    const soundInstances = [];
    for (let i = 0; i < 5; i++) {
        const audio = letterSound.cloneNode();
        audio.volume = 0.3;
        soundInstances.push(audio);
    }
    
    let soundIndex = 0;
    
    letters.forEach((letter, index) => {
        setTimeout(() => {
            const sound = soundInstances[soundIndex % soundInstances.length];
            sound.currentTime = 0;
            sound.play().catch(() => {});
            soundIndex++;
            
            letter.style.filter = 'drop-shadow(0 0 15px #FF69B4) drop-shadow(0 0 30px #FF1493)';
            setTimeout(() => {
                letter.style.filter = '';
            }, 500);
        }, index * 100 + 100);
    });
    
    entryPage.addEventListener('click', function() {
        const transitionSound = soundInstances[0];
        transitionSound.volume = 0.5;
        transitionSound.play().catch(() => {});
        
        entryPage.classList.add('fade-out');
        
        setTimeout(() => {
            entryPage.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.classList.add('show');
            initBackgroundMusic();
        }, 1000);
    });
    
    setTimeout(() => {
        if (entryPage.style.display !== 'none') {
            entryPage.click();
        }
    }, 8000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login page first
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('usernameInput');
    
    if (loginBtn) loginBtn.addEventListener('click', loginUser);
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginUser();
            }
        });
    }
    
    const musicToggle = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const musicSelector = document.getElementById('musicSelector');
    const viewSavedControlBtn = document.getElementById('viewSavedControlBtn');
    const aiChatBtn = document.getElementById('aiChatBtn');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    const generateBtn = document.getElementById('generateBtn');
    const newPlaylistBtn = document.getElementById('newPlaylistBtn');
    const getMoreBtn = document.getElementById('getMoreBtn');
    const addAIBtn = document.getElementById('addAIBtn');
    const savePlaylistBtn = document.getElementById('savePlaylistBtn');
    const viewSavedBtn = document.getElementById('viewSavedBtn');
    const spotifyBtn = document.getElementById('spotifyBtn');
    const moodSelect = document.getElementById('mood');
    
    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);
    if (volumeSlider) volumeSlider.addEventListener('input', adjustVolume);
    if (musicSelector) musicSelector.addEventListener('change', changeMusicType);
    if (viewSavedControlBtn) viewSavedControlBtn.addEventListener('click', viewSavedPlaylists);
    if (aiChatBtn) aiChatBtn.addEventListener('click', openAIChat);
    if (sendChatBtn) sendChatBtn.addEventListener('click', sendChatMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    if (generateBtn) generateBtn.addEventListener('click', generatePlaylist);
    if (newPlaylistBtn) newPlaylistBtn.addEventListener('click', createNewPlaylist);
    if (getMoreBtn) getMoreBtn.addEventListener('click', getMoreSongs);
    if (addAIBtn) addAIBtn.addEventListener('click', addAIRecommendedSongs);
    if (savePlaylistBtn) savePlaylistBtn.addEventListener('click', savePlaylist);
    if (viewSavedBtn) viewSavedBtn.addEventListener('click', viewSavedPlaylists);
    if (spotifyBtn) spotifyBtn.addEventListener('click', createSpotifyPlaylist);
    if (moodSelect) moodSelect.addEventListener('change', function() {
        highlightMoodStickers(this.value);
    });
    
    // Check for Spotify callback
    if (window.location.hash.includes('access_token')) {
        handleSpotifyCallback();
    } else {
        checkSpotifyConnection();
    }
    
    setTimeout(() => {
        setInterval(createRandomSticker, 3000);
        setInterval(createStickerBurst, 12000);
    }, 1000);
});