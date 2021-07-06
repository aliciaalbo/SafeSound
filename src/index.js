import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import useStickyState from "./useStickyState";
import WebPlayer from "./webplayer";
import SpotPlayer from "./spotplayer";
import PlaylistSearch from "./playlistSearch"
import SpotifyLogin from './spotifylogin';
import ShowPlaylists from './playlists';
import ShowSongs from './songs';
import Logout from "./logout";

function App() {
    const [playlistSearchTerm, setPlaylistSearchTerm] = useStickyState("", "playlistSearchTerm");
    const [playlists, setPlaylists] = useStickyState("", "playlists");
    const [playstate, setPlaystate] = useStickyState("");
    const [access_token, setAccessToken] = useStickyState("", "access_token");
    const [name, setName] = useStickyState("", "name");
    const [email, setEmail] = useStickyState("", "email");


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

      fetch(`/api?do=getPlaylists&term=${encodeURIComponent(playlistSearchTerm)}`)
      .then((res) => res.json())
      .then((res) => {
              console.log(res)  
              setPlaylists(res)})
    }

    const logoutUser = (email) => {
      if (email) {
        fetch(`/api?do=logout&email=${encodeURIComponent(email)}`)
        .then(() => {
          console.log('logout attempt')
          setAccessToken("");
          setName("");
          setEmail("");
        })
        .catch((err) => {
            console.log("ERROR: ",err);
        });
      }
    };

    return (
      <section className="page">
        <div>SAFESOUND, DANGERBALLS</div>
        <PlaylistSearch fetchPlaylists={fetchPlaylists} />
        <SpotifyLogin />
        <ShowPlaylists />
        <ShowSongs />
        <Logout />
        {access_token && deviceId ? 
              
              <SpotPlayer playbackToggle={playbackToggle} setPlaybackToggle={setPlaybackToggle} access_token={access_token} webplayer={webplayer} deviceId={deviceId} playstate={playstate} isPaused={isPaused} curTrackId={curTrackId} />
              
              : null}
              {/* add to spotplayer later playlist={playlist} */}
      </section>
    );
  }

ReactDOM.render(<App />, document.getElementById("app"));

export default App;