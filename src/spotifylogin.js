import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

function SpotifyLogin() {
  const handleClick = (e) => {
    e.preventDefault();
    // to get account info for users: user-read-email
    // to save playlist: playlist-modify-public
    // to stream in player: streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state
    // to show the favorite button: user-library-read user-library-modify
    // also in there for some reason: user-read-currently-playing
    const scopes = 'user-read-email playlist-modify-public streaming user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify user-read-currently-playing';
    const callbackurl = 'http://localhost:5000/callback';
    window.location.href='https://accounts.spotify.com/authorize?response_type=code' +
    '&client_id=abaeefb2130e47db9598b38066ae8d5b' +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(callbackurl);
  };

  // className="btn-actions justify-content-center flex-nowrap"
  return (
    <button variant="dark" className="btn btn-secondary" onClick={e => { handleClick(e) }}>
      <FontAwesomeIcon icon={faSpotify} size="2x" />
      <span>&nbsp; Login with Spotify</span>
    </button>
  )
}



export default SpotifyLogin;
