import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import useStickyState from "./useStickyState";
import WebPlayer from "./webplayer";
import SpotPlayer from "./spotplayer";
import PlaylistSearch from "./playlistSearch"
import SpotifyLogin from './spotifylogin';
import ShowPlaylists from './playlists';
import Tracks from './tracks';
import Logout from "./logout";
import Filters from "./filters";
import ProfanityLight from './profanityLight';
import ProfanityDark from './profanityDark';
import SexyLight from './sexyLight';
import SexyDark from './sexyDark';
import RacistLight from './racistLight';
import RacistDark from './racistDark';
import ShowTracks from './showTracks';
import ApplyFilters from './applyFilters';
import ShowFeaturedPlaylists from './spotifyFeaturedPlaylists';
import AllowNoLyrics from './allowNoLyrics'
import ShowUserPlaylists from './showUserPlaylists';
import UserPlaylists from './userPlaylists';

function App() {
    const [playlistSearchTerm, setPlaylistSearchTerm] = useStickyState("", "playlistSearchTerm");
    const [playlists, setPlaylists] = useStickyState("", "playlists");
    const [playstate, setPlaystate] = useStickyState("");
    const [access_token, setAccessToken] = useStickyState("", "access_token");
    const [name, setName] = useStickyState("", "name");
    const [email, setEmail] = useStickyState("", "email");
    const [profanityIsActive, setProfanityIsActive] = useStickyState(false);
    const [sexyIsActive, setSexyIsActive] = useStickyState(false);
    const [racistIsActive, setRacistIsActive] = useStickyState(false);
    const [tracks, setTracks] = useStickyState([], "tracks")
    const [pid, setPid] = useStickyState("", "pid");
    const [failingTracks, setFailingTracks] = useState([]);
    const [passingTracks, setPassingTracks] = useState([])
    const [allowNoLyrics, setAllowNoLyrics] = useStickyState(false)
    const [userPlaylists, setUserPlaylists] = useStickyState("", "userPlaylists")


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
      setTracks("");

      fetch(`/api?do=getPlaylists&term=${encodeURIComponent(playlistSearchTerm)}`)
      .then((res) => res.json())
      .then((res) => {
              console.log(res)  
              setPlaylists(res)
          })
    }

    const fetchUserPlaylists = () => {
      fetch(`/api?do=getUserPlaylists`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setUserPlaylists(res)
      })
    }

    const fetchTracks = (pid) => {
      setPid(pid);
      fetch(`/api?do=getTracks&pid=${encodeURIComponent(pid)}`)
      .then((res) => res.json())
      .then((res) => {
              console.log(res)  
              setTracks(res)
            })
      setPlaylists("");
    }

    const applyFilters = () => {
      let activeFilters = [];
      if(racistIsActive === true){
        activeFilters.push('racist')
      };
      if(profanityIsActive === true){
        activeFilters.push('profanity')
      };
      if(sexyIsActive === true){
        activeFilters.push('sexy')
      };
      fetch(`/api?do=filterTracks&activeFilters={activeFilters}&allowNoLyrics={allowNoLyrics}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
      })
    }

    const activateFilter = (filter) => {
      if(filter === "profanity"){
        setProfanityIsActive(true);
        console.log('profanity filter active')
      };
      if(filter === "sexy"){
        setSexyIsActive(true);
        console.log('sexy filter active')
      };
      if(filter === "racist"){
        setRacistIsActive(true);
        console.log('racist filter active')
      };
    }

    const deactivateFilter = (filter) => {
      if(filter === "profanity"){
        setProfanityIsActive(false);
        console.log('profanity filter not active')
      };
      if(filter === "sexy"){
        setSexyIsActive(false);
        console.log('sexy filter not active')
      };
      if(filter === "racist"){
        setRacistIsActive(false);
        console.log('racist filter not active')
      };
    }

    // const fetchFilteredPlaylist = (playlist_id, profanityIsActive) => {

    // }

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
        <ShowFeaturedPlaylists setPid={setPid}/>
        <ShowUserPlaylists fetchUserPlaylists={fetchUserPlaylists} setPid={setPid} />
        {userPlaylists.length ? <UserPlaylists userPlaylists={userPlaylists} /> : null}
        <AllowNoLyrics setAllowNoLyrics={setAllowNoLyrics}/>
        {playlists.length ? <ShowPlaylists playlists={playlists} fetchTracks={fetchTracks} setPid={setPid} /> : null}
        <ShowTracks pid={pid} fetchTracks={fetchTracks} />
        {pid && tracks.length ? <Tracks tracks={tracks} /> : null }
        {tracks.length ? <ApplyFilters tracks={tracks} applyFilters={applyFilters}/> : null }
        <Logout logoutUser={logoutUser} />
        {profanityIsActive ? <ProfanityDark deactivateFilter={deactivateFilter}  /> : <ProfanityLight activateFilter={activateFilter}  />}
        {sexyIsActive ? <SexyDark deactivateFilter={deactivateFilter}  /> : <SexyLight activateFilter={activateFilter}  />}
        {racistIsActive ? <RacistDark deactivateFilter={deactivateFilter}  /> : <RacistLight activateFilter={activateFilter}  />}
        {access_token && deviceId && tracks.length ? 
              
              <SpotPlayer playbackToggle={playbackToggle} setPlaybackToggle={setPlaybackToggle} access_token={access_token} webplayer={webplayer} deviceId={deviceId} playstate={playstate} isPaused={isPaused} curTrackId={curTrackId} />
              
              : null}
              {/* add to spotplayer later playlist={playlist} */}
      </section>
    );
  }

ReactDOM.render(<App />, document.getElementById("app"));

export default App;