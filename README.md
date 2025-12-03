# 🌙 LUNAR PLAYLIST CRAFT 🎵

A cosmic-themed playlist generator with AI recommendations, user authentication, and Spotify integration.

## ✨ Features

- **🌙 Lunar-themed UI** - Pixelated retro design with space aesthetics
- **🤖 AI Chat Assistant** - Luna AI provides personalized music recommendations
- **🎵 Smart Playlist Generation** - Create playlists based on mood, genre, and duration
- **👤 User Authentication** - Login system with password recovery
- **💾 Playlist Management** - Save, load, and manage your cosmic playlists
- **🎧 Background Music** - Multiple Minecraft-inspired ambient tracks
- **🎯 Spotify Integration** - Export playlists directly to Spotify
- **📱 Responsive Design** - Works on desktop and mobile devices

## 🚀 Quick Start

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Enter a username** to start your lunar journey
4. **Generate playlists** and explore the cosmic music universe!

## 📁 Project Structure

```
angel_project/
├── index.html          # Main application file
├── styles.css          # Lunar-themed styling
├── script.js           # Core playlist functionality
├── enhanced-login.js   # Authentication system
├── auth.js            # User management
├── database.js        # Local storage handling
├── README.md          # This file
├── EMAIL_SETUP.md     # Email configuration guide
└── SPOTIFY_SETUP.md   # Spotify API setup guide
```

## 🎮 How to Use

### 1. Login
- Enter any username to create/access your lunar profile
- No password required for basic functionality
- Your playlists are saved locally in your browser

### 2. Generate Playlists
- **Select Mood**: Choose from 6 cosmic moods (Happy, Chill, Energetic, etc.)
- **Pick Genre**: 8 musical dimensions (Pop, Rock, Hip-Hop, etc.)
- **Set Duration**: Mission length from 30 minutes to 3 hours
- **AI Input**: Optional preferences for Luna AI

### 3. AI Assistant
- Click the 🤖 button to chat with Luna AI
- Ask for music recommendations based on your feelings
- Luna learns from your mood history for better suggestions

### 4. Playlist Management
- **Save**: Store playlists in your lunar vault
- **Load**: Access previously saved playlists
- **Export**: Send to Spotify (requires setup)

## 🔧 Configuration

### Spotify Integration
1. Create a Spotify Developer account
2. Register your application
3. Update `SPOTIFY_CLIENT_ID` in `script.js`
4. See `SPOTIFY_SETUP.md` for detailed instructions

### Email Features
1. Create an EmailJS account
2. Update the service ID in `enhanced-login.js`
3. See `EMAIL_SETUP.md` for configuration

## 🎵 Music Controls

- **🎵 Toggle**: Start/stop background music
- **🎧 Selector**: Choose from 7 Minecraft-inspired themes
- **🔊 Volume**: Adjust audio levels
- **📁 Vault**: Quick access to saved playlists

## 🌟 AI Chat Commands

Luna AI responds to various inputs:

### Mood-based
- "I'm feeling sad" → Offers healing playlist options
- "I'm happy" → Suggests celebration music
- "I'm stressed" → Provides calming recommendations

### Activity-based
- "workout playlist" → High-energy exercise music
- "study music" → Focus-enhancing tracks
- "party playlist" → Dance and celebration songs

### Genre requests
- "rock music" → Rock-focused recommendations
- "jazz playlist" → Smooth jazz selections
- "surprise me" → Random genre exploration

## 💾 Data Storage

All data is stored locally in your browser:
- **User profiles** - Username and preferences
- **Saved playlists** - Your cosmic music collections
- **Mood history** - AI learning data
- **Settings** - Music preferences and volume

## 🎨 Customization

### Themes
The app uses a retro pixelated aesthetic with:
- Pink/magenta color scheme
- Press Start 2P font
- Floating emoji stickers
- Minecraft-inspired audio

### Adding Songs
Edit the `songDatabase` object in `script.js` to add new tracks:
```javascript
happy: {
    pop: ['Your Song - Artist', 'Another Song - Artist'],
    // ... more genres
}
```

## 🐛 Troubleshooting

### Audio Issues
- **No sound**: Check browser audio permissions
- **Music won't play**: Try clicking the page first (browser autoplay policy)

### Spotify Export
- **Connection failed**: Verify Client ID and redirect URI
- **Songs not found**: Some tracks may not be available on Spotify

### Data Loss
- **Playlists disappeared**: Check if you're using the same username
- **Settings reset**: Clear browser cache may cause data loss

## 🌙 Browser Compatibility

- **Chrome**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅
- **Edge**: Full support ✅
- **Mobile browsers**: Responsive design ✅

## 📱 Mobile Experience

The app is fully responsive with:
- Touch-friendly controls
- Optimized text sizes
- Simplified navigation
- Gesture support

## 🔮 Future Features

- Cloud sync for playlists
- More AI personality options
- Additional music streaming services
- Collaborative playlists
- Advanced mood detection

## 🎯 Tips for Best Experience

1. **Use headphones** for the full audio experience
2. **Chat with Luna AI** for personalized recommendations
3. **Save your favorites** to build your cosmic collection
4. **Try different moods** to discover new music styles
5. **Connect Spotify** for seamless playlist export

## 🌟 Credits

- **Design**: Retro pixelated space theme
- **Fonts**: Press Start 2P (Google Fonts)
- **Audio**: Web Audio API for Minecraft-style music
- **Icons**: Unicode emoji characters

---

**Ready to explore the cosmos of music? Start your lunar journey now!** 🚀🌙✨