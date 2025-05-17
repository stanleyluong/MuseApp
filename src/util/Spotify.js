import axios from 'axios';

const clientID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
let accessToken;
let redirectURI =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/"
    : "https://museapp.stanleyluong.com/";

const Spotify = {
    getAccessToken(forceLogin = false) {
        // Always use token from localStorage if available
        if (!forceLogin) {
            const storedToken = localStorage.getItem('spotify_access_token');
            if (storedToken) {
                accessToken = storedToken;
                return accessToken;
            }
        }
        // If forceLogin or no token, redirect to Spotify
        const hash = window.location.hash;
        const accessTokenMatch = hash.match(/access_token=([^&]*)/);
        if (accessTokenMatch) {
            accessToken = accessTokenMatch[1];
            localStorage.setItem('spotify_access_token', accessToken);
            window.location.hash = '';
            return accessToken;
        }
        // Redirect to Spotify login
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public ugc-image-upload&redirect_uri=${redirectURI}&show_dialog=true`;
        window.location = accessUrl;
    },
    async search(term) {
        console.log('searching', term)
        console.log(accessToken, 'access token')
        accessToken = Spotify.getAccessToken()
        try {
            const response = await axios.get(`https://api.spotify.com/v1/search`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { type: 'track', q: term }
            });
            const jsonResponse = response.data;
            console.log(jsonResponse.tracks.items)
            if (!jsonResponse.tracks) {
                return []
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                popularity: track.popularity,
                preview_url: track.preview_url,
                duration_ms: track.duration_ms
            }));
        } catch (error) {
            console.error('Error searching tracks:', error);
            return [];
        }
    },
    async savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        try {
            // Get user ID
            const userResponse = await axios.get('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userId = userResponse.data.id;
            // Create playlist
            const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, { name }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const playlist = playlistResponse.data;
            const playlistId = playlist.id;
            // Add tracks
            await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { uris: trackUris }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            // Return the playlist object for optimistic update
            return playlist;
        } catch (error) {
            console.error('Error saving playlist:', error);
        }
    },
    async getUserPlaylists() {
        const accessToken = Spotify.getAccessToken();
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data.items || [];
        } catch (error) {
            console.error('Error fetching playlists:', error);
            return [];
        }
    },
    async getPlaylistTracks(playlistId) {
        const accessToken = Spotify.getAccessToken();
        try {
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return (response.data.items || []).map(item => ({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                uri: item.track.uri,
                popularity: item.track.popularity,
                preview_url: item.track.preview_url
            }));
        } catch (error) {
            console.error('Error fetching playlist tracks:', error);
            return [];
        }
    },
    async updatePlaylist(playlistId, name, uris) {
        const accessToken = Spotify.getAccessToken();
        try {
            // Update playlist name
            await axios.put(`https://api.spotify.com/v1/playlists/${playlistId}`, { name }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            // Replace playlist tracks
            await axios.put(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { uris }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error updating playlist:', error);
        }
    },
    async uploadPlaylistCover(playlistId, base64Image) {
        const accessToken = Spotify.getAccessToken();
        try {
            await axios.put(
                `https://api.spotify.com/v1/playlists/${playlistId}/images`,
                base64Image,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'image/jpeg',
                    },
                }
            );
        } catch (error) {
            console.error('Error uploading playlist cover:', error);
            throw error;
        }
    }
}
///
export default Spotify

// const clientID = '********************';
// const redirectURI = "http://localhost:3000/";

// let accessToken;
// const Spotify = {
//     getAccessToken() {
//         if(accessToken) {
//             return accessToken;
//         }

//         //check for access token match
//         const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
//         const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

//         //check if access token and expiry time are in the URL
//         if(accessTokenMatch && expiresInMatch) {
//             accessToken = accessTokenMatch[1];
//             const expiresIn = Number(expiresInMatch[1]);
//             //this clears the parameters and allows us to grab a new access token when it expires
//             window.setTimeout(() => accessToken = '', expiresIn * 1000);
//             window.history.pushState('Access Token', null, '/');
//             return accessToken;
//         } else {
//             const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
//             window.location = accessUrl;
//         }
//     },

//     search(term) {
//         const accessToken = Spotify.getAccessToken();
//         return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {
//             Authorization: `Bearer ${accessToken}`
//             }
//         })
//         .then(response => {
//             return response.json();
//         })
//         .then(jsonResponse => {
//             if(!jsonResponse.tracks) {
//                 return [];
//             }
//             return jsonResponse.tracks.items.map(track => ({
//                 id: track.id,
//                 name: track.name,
//                 artist: track.artists[0].name,
//                 album: track.album.name,
//                 URI: track.uri
//             })) //end of map

//         }) //end of then
//     }, //end of search

//     savePlaylist(name, trackUris) {

//         if(!name || !trackUris.length) {
//             return;
//         }

//         const accessToken = Spotify.getAccessToken();
//         const headers = {Authorization: `Bearer ${accessToken}`};
//         let userId;

//         return fetch('https://api.spotify.com/v1/me', {headers: headers})
//         .then(response => {
//             return response.json();
//         })
//         .then(jsonResponse => {
//             userId = jsonResponse.id;
//             return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
//             {
//                 headers: headers,
//                 method: 'POST',
//                 body: JSON.stringify({ name: name })
//             })
//             .then(response => {
//                 return response.json();
//             })
//             .then(jsonResponse => {
//                 const playlistId = jsonResponse.id;
//                 return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,  //there is also an error here
//                 {
//                     headers: headers,
//                     method: 'POST',
//                     body: JSON.stringify({ uris: trackUris })
//                 })
//             })
//         })


//     } //end of savePlaylist
// }; //end of Spotify

// export default Spotify;