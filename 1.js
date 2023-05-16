import axios from 'axios';
import * as fs from 'fs';

const clientId = 'ad43b24a678a4ca3927cce3b545e6c1f';
const clientSecret = '6e0f20ce547c4c789f7b16bb65bfe702';
const getPlaylistData = async () => {
  try {
    // Read the playlist IDs from the file
    const playlistIds = fs.readFileSync('playlists.txt', 'utf8').split('\n');
     // Authenticate with the Spotify API
    const authResponse = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });
    let albumOutput = '';
    let trackOutput = '';
     // Retrieve the data for each playlist
    for (let playlistId of playlistIds) {
      playlistId = playlistId.split('/').at(4);
       if (playlistId.length === 0) {
        continue;
      }
      try {
        const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${authResponse.data.access_token}`,
          },
        });
        const albumLinks = playlistResponse.data.tracks.items.map(item => item.track.album.external_urls.spotify);
        const trackLinks = playlistResponse.data.tracks.items.map(item => item.track.external_urls.spotify);
        //Append output data
        // outputData += `Playlist ${playlistId}\nAlbum Links:\n${albumLinks.join('\n')}\n\nTrack Links:\n${trackLinks.join('\n')}\n\n`;
        albumOutput += `${albumLinks.join('\n')}\n`;
        trackOutput += `${trackLinks.join('\n')}\n`;
      } catch (error) {
            if (error.response && error.response.status === 404) {
            //   console.log(`Playlist ${playlistId} not found.`);
            } else {
            console.log(`Error retrieving playlist ${playlistId}:`, error.message);
            }
      }
    }
    // Write output to file
    fs.writeFileSync('./links/albums.txt', albumOutput);
    fs.writeFileSync('./links/tracks.txt', trackOutput);
    console.log('Output files have been made successfully.');
  } catch (error) {
    console.log(error);
  }
};
 getPlaylistData();