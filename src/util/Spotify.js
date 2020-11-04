let accessToken, clientID = 'c52ced1d33f34b66aea1905a4afe30d0',redirectURI='http://localhost:3000'

const Spotify = {
    getAccessToken(){
            if(accessToken) {
                return accessToken;
            }
            const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
            const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
            if(accessTokenMatch && expiresInMatch) {
                accessToken = accessTokenMatch[1];
                const expiresIn = Number(expiresInMatch[1]);
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            } else {
                const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
                window.location = accessUrl;
            }
    },
    search(term){
        console.log('searching',term)
        console.log(accessToken,'access token')
        accessToken = Spotify.getAccessToken()
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response=>{
            console.log('response',response)
            return response.json()
        }).then(jsonResponse=>{
            console.log(jsonResponse.tracks.items)
            if(!jsonResponse.tracks){
                return []
            }
            return jsonResponse.tracks.items.map(track=>{
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
            })
        })
    },
    savePlaylist(name, trackUris) {
        console.log(1);

        if(!name || !trackUris.length) {
            return;
        }

        console.log(2);

        // const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;
        console.log(3);
        return fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => {
            console.log(4);
            return response.json();
        })
        .then(jsonResponse => {
            console.log(5);
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            })
            .then(response => {
                console.log(6);
                return response.json();
            })
            .then(jsonResponse => {
                console.log(7);
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,  //there is also an error here
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                })
            })
        })


    }
    // savePlaylist(playlistName,trackUriArray){
    //     if(playlistName && trackUriArray){
    //         let accesstoken = Spotify.getAccessToken()
    //         console.log(accesstoken,'heiei')
    //         let headers = {
    //             Authorization: `Bearer ${accesstoken}`,
    //         }
    //         let id
    //         return fetch(`https://api.spotify.com/v1/me`, {
    //             headers: headers
    //         })
    //         .then(response=>{
    //             return response.json()
    //         })
    //         .then(jsonResponse=>{
    //             console.log(jsonResponse)
    //             id = jsonResponse.id

    //             return fetch(`https://api.spotify/v1/users/${id}/playlists`,{
    //                 headers:headers,
    //                 method: 'POST',
    //                 body: JSON.stringify({
    //                     name: playlistName
    //                 })
    //             })
    //             .then(response=>{
    //                 return response.json()
    //             })
    //             .then(jsonResponse=>{
    //                 let playlistID = jsonResponse.id  
    //                 return fetch(`https://api.spotify.com/v1/users/${id}/playlists/${playlistID}/tracks`,{
    //                     headers:headers,
    //                     method: 'POST',
    //                     body: JSON.stringify({
    //                         uris: trackUriArray
    //                     })
    //                 })
    //             })
    //         })
    //     } else {
    //         return
    //     }
    // }
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