# Spotify Integration Setup

## 1. Get Spotify Credentials
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in:
   - App Name: "Minecraft Audio Generator"
   - App Description: "Audio generator with Spotify integration"
   - Redirect URI: `http://localhost:8000/spotify_integration.html`
5. Copy your **Client ID**

## 2. Update the Code
Replace `YOUR_CLIENT_ID` in `spotify_integration.html` line 45 with your actual Client ID:
```javascript
clientId: 'your_actual_client_id_here',
```

## 3. Run Local Server
```bash
cd c:\Users\lenovo\Downloads\angel_project
python -m http.server 8000
```

## 4. Open in Browser
Navigate to: `http://localhost:8000/spotify_integration.html`

## Features
- **Connect to Spotify**: Authenticate with your Spotify account
- **Search**: Find any song on Spotify
- **Play**: Click search results to play tracks
- **Minecraft Audio**: Generate themed audio like before

## Requirements
- Spotify Premium account (for Web Playback SDK)
- Modern browser with Web Audio API support