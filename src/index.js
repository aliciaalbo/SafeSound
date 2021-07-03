import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import useStickyState from "./useStickyState";
import PlaylistSearch from "./playlistSearch"

function App() {
    const [playlistSearchTerm, setPlaylistSearchTerm] = useStickyState("", "playlistSearchTerm");

    // player state items we don't want to persist
    const [isReady, setIsReady] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [isPaused, setIsPaused] = useState(true);
    const [curTrackId, setCurTrackId] = useState("");
    const [playbackToggle, setPlaybackToggle] = useState('no');

    // instantiate the Spotify Player passes props in object to webplayer.js
    //  isPaused: isPaused, curTrackId: curTrackId, 
    let webplayer = WebPlayer({ access_token: access_token, isReady: isReady, setIsReady: setIsReady, setDeviceId: setDeviceId, setIsPaused: setIsPaused, setCurTrackId: setCurTrackId });

    // load the access token through Python's session if can
    if (!access_token) {
      console.log('access token check');
      fetch(`/api?do=getInfo`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(data)
          setAccessToken(data.access_token);
          setName(data.name);
          setEmail(data.email);
        
          console.log('access token set!');
        }
      })
      .catch((err) => {
        console.log("ERROR: ",err);
      });
    }

    const fetchPlaylists = (playlistSearchTerm) => {
      setPlaylistSearchTerm(playlistSearchTerm);

      fetch(`/api?do=getPlaylists&zterm=${encodeURIComponent(playlistSearchTerm)}`)
    }


  }


ReactDOM.render(<App />, document.getElementById("app"));

export default App;