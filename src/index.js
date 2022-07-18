import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import useStickyState from "./useStickyState";
// import WebPlayer from "./webplayer";
// import SpotPlayer from "./spotplayer";
import PlaylistSearch from "./playlistSearch"
import SpotifyLogin from './spotifylogin';
import ShowPlaylists from './playlists';
import Tracks from './tracks';
import Logout from "./logout";
// import FilterLevel from "./filterLevel";
import ShowTracks from './showTracks';
import ApplyFilters from './applyFilters';
import ShowFeaturedPlaylists from './spotifyFeaturedPlaylists';
import AllowNoLyrics from './allowNoLyrics'
import ShowUserPlaylists from './showUserPlaylists';
import UserPlaylists from './userPlaylists';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import SavePlaylist from './savePlaylist';

function App() {
    // stickyState only works for strings, atm
    const [playlistSearchTerm, setPlaylistSearchTerm] = useState("", "playlistSearchTerm");
    const [playlists, setPlaylists] = useState("", "playlists");
    const [playstate, setPlaystate] = useState("", "playstate");
    const [access_token, setAccessToken] = useState("", "access_token");
    const [name, setName] = useStickyState("", "name");
    const [email, setEmail] = useStickyState("", "email");
    const [tracks, setTracks] = useState([], "tracks")
    const [pid, setPid] = useState("", "pid");
    const [playlistName, setPlaylistName] = useState("", "playlistName")
    // const [heldPlaylistName, setHeldPlaylistName] = useState("", "heldPlaylistName")
    const [failingTrackIds, setFailingTrackIds] = useState([]);
    const [passingTracks, setPassingTracks] = useState([])
    const [allowNoLyrics, setAllowNoLyrics] = useState(false, "allowNoLyrics")
    const [userPlaylists, setUserPlaylists] = useState("", "userPlaylists")
    const [isProcessing, setIsProcessing] = useState(false)

    // player state items we don't want to persist
    const [isReady, setIsReady] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [isPaused, setIsPaused] = useState(true);
    const [curTrackId, setCurTrackId] = useState("");
    const [playbackToggle, setPlaybackToggle] = useState('no');
    // const [pid, setPid] = useState("");
    const [isError, setIsError] = useState(false);



    // instantiate the Spotify Player passes props in object to webplayer.js
    //  isPaused: isPaused, curTrackId: curTrackId, 
    // const webplayer = WebPlayer({ access_token: access_token, isReady: isReady, setIsReady: setIsReady, setDeviceId: setDeviceId, setIsPaused: setIsPaused, setCurTrackId: setCurTrackId });

    // load the access token through Python's session if can
    if (!access_token) {
      console.log('access token check');
      fetch(`/api?do=getInfo`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("access token data: ", data)
          setAccessToken(data.access_token);
          setName(data.name);
          setEmail(data.email);
        
          console.log('access token set!');
        }
      })
      .catch((err) => {
        console.log("access token ERROR: ", err);
      });
    }

    const fetchPlaylists = (playlistSearchTerm) => {
      setPlaylistSearchTerm(playlistSearchTerm);
      setTracks([]);

      fetch(`/api?do=getPlaylists&term=${encodeURIComponent(playlistSearchTerm)}`)
      .then((res) => res.json())
      .then((res) => {
              console.log("fetchPlaylists res: ", res)  
              setPlaylists(res)
          })
    }

    const fetchUserPlaylists = () => {
      fetch(`/api?do=getUserPlaylists`)
      .then((res) => res.json())
      .then((res) => {
        console.log("fetchUserPlaylists res: ", res)
        setUserPlaylists(res)
      })
    }

    const fetchTracks = (pid, playlistName) => {
      setPlaylistName(playlistName)
      setIsProcessing(true)
      setPid(pid);
      // clear current track list
      setTracks([]);
      setPassingTracks([]);
      setFailingTrackIds([]);
      fetch(`/api?do=getTracks&pid=${encodeURIComponent(pid)}`)
      .then((res) => res.json())
      .then((res) => {
              console.log("fetchTracks res: ", res)  
              // setPlaylistName(playlistName);
              setTracks(res)
              setIsProcessing(false)
              // setPlaylistName(playlistName);
            });
      // setPlaylists("");
      // setPlaylistName(playlistName);
  
    }

    const applyFilters = (tracks, allowedCount) => {
      const params = {
        track_ids: tracks.map((track) => track.id),
        allow_no_lyrics: allowNoLyrics,
        allowed_count: allowedCount,
      };
      fetch("/api?do=filterTracks",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        }
      )
      .then((res) => res.json())
      .then((res) => {
        console.log("applyFilters res: ", res)
        setFailingTrackIds(res)
        setPassingTracks(res)
      })
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
            console.log("logoutUser ERROR: ",err);
        });
      }
    };

    return (
      <section className="page">
        <div id="container">
          <div id="header-block">
            <SpotifyLogin />
            <Logout logoutUser={logoutUser} /><br /><br />
          </div>

          <div id="left-sidebar">
            {/* Search */}
            <PlaylistSearch fetchPlaylists={fetchPlaylists} />
          </div>

          <div id="main-block">
            <div id="filters">
              {access_token && failingTrackIds ? <SavePlaylist tracks={tracks} failingTrackIs={failingTrackIds} access_token={access_token} username={name} playlistName={playlistName} pid={pid} setPid={setPid} setIsError={setIsError} /> : null}
              <AllowNoLyrics setAllowNoLyrics={setAllowNoLyrics}/>
              <ShowUserPlaylists fetchUserPlaylists={fetchUserPlaylists}  />
              {pid ? (
                <ShowTracks
                  pid={pid}
                  fetchTracks={fetchTracks}
                  playlistName={playlistName}
                />
              ) : null}
              {tracks.length ? <ApplyFilters tracks={tracks} applyFilters={applyFilters}/> : null }
            </div>

            {/* Tracks */}
            {pid && playlistName ?
              <Tracks
                tracks={tracks}
                failingTrackIds={failingTrackIds}
                playlistName={playlistName}
                isProcessing={isProcessing}
              /> : null }
  
            {/* Featured Playlists */}
            <ShowFeaturedPlaylists
              setPid={setPid}
              setPlaylistName={setPlaylistName}
              setTracks={setTracks}
            />
 
            {/* Spotify Player
            {access_token && deviceId && tracks.length ? 
            <SpotPlayer playbackToggle={playbackToggle} setPlaybackToggle={setPlaybackToggle} access_token={access_token} webplayer={webplayer} deviceId={deviceId} playstate={playstate} isPaused={isPaused} curTrackId={curTrackId} />
            : null}
            {/* add to spotplayer later playlist={playlist} */} 
          </div>

          <div id="right-sidebar">
            {/* User Playlists */}
            {userPlaylists.length ? (
              <UserPlaylists
                userPlaylists={userPlaylists}
                setPid={setPid}
                setPlaylistName={setPlaylistName}
                fetchTracks={fetchTracks}
              />
            ) : null}
            {playlists.length ? (
              <ShowPlaylists
                playlists={playlists}
                setPid={setPid}
                setPlaylistName={setPlaylistName}
                fetchTracks={fetchTracks}
              />
            ) : null}
          </div>
        </div>
      </section>
    );
  }

ReactDOM.render(<App />, document.getElementById("app"));

export default App;