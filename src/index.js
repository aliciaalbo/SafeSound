import React, { useState, useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom'
import useStickyState from "./useStickyState"
// import WebPlayer from "./webplayer"
// import SpotPlayer from "./spotplayer"
import PlaylistSearch from "./playlistSearch"
import SpotifyLogin from './spotifylogin'
import ShowPlaylists from './playlists'
import Tracks from './tracks'
import Logout from "./logout"
// import FilterLevel from "./filterLevel"
import ShowTracks from './showTracks'
import ApplyFilters from './applyFilters'
import ShowFeaturedPlaylists from './spotifyFeaturedPlaylists'
import AllowNoLyrics from './allowNoLyrics'
import ShowUserPlaylists from './showUserPlaylists'
import UserPlaylists from './userPlaylists'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import SavePlaylist from './savePlaylist'
import AllowInstrumental from './instrumental'

function App() {
  // stickyState only works for strings, atm
  const [playlistSearchTerm, setPlaylistSearchTerm] = useState("", "playlistSearchTerm")
  const [playlists, setPlaylists] = useState("", "playlists")
  const [playstate, setPlaystate] = useState("", "playstate")
  const [access_token, setAccessToken] = useState("", "access_token")
  const [name, setName] = useStickyState("", "name")
  const [email, setEmail] = useStickyState("", "email")
  const [tracks, setTracks] = useState([], "tracks")
  const [pid, setPid] = useState("", "pid")
  const [playlistName, setPlaylistName] = useState("", "playlistName")
  const [failingTrackIds, setFailingTrackIds] = useState([])
  const [passingTracks, setPassingTracks] = useState([])
  const [allowNoLyrics, setAllowNoLyrics] = useState(false, "allowNoLyrics")
  const [allowInstrumental, setAllowInstrumental] = useState(true, "allowInstrumental")
  const [userPlaylists, setUserPlaylists] = useState("", "userPlaylists")
  const [isProcessing, setIsProcessing] = useState(false)

  // player state items we don't want to persist
  const [isReady, setIsReady] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [isPaused, setIsPaused] = useState(true)
  const [curTrackId, setCurTrackId] = useState("")
  const [playbackToggle, setPlaybackToggle] = useState('no')
  const [isError, setIsError] = useState(false)



  // instantiate the Spotify Player passes props in object to webplayer.js
  //  isPaused: isPaused, curTrackId: curTrackId, 
  // const webplayer = WebPlayer({ access_token: access_token, isReady: isReady, setIsReady: setIsReady, setDeviceId: setDeviceId, setIsPaused: setIsPaused, setCurTrackId: setCurTrackId });

  // load the access token through Python's session if can
  // if (!access_token) {

  const getInfo = () => {

    fetch(`/api?do=getInfo`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("access token data: ", data)
          setAccessToken(data.access_token)
          setName(data.name)
          setEmail(data.email)
        } else {
          setAccessToken("")
          setName("")
          setEmail("")
        }
      })
      .catch((err) => {
        console.log("access token ERROR: ", err)
      })
  }

  useEffect(() => {
    getInfo()
  }, [getInfo])

  const processTracks = useCallback((curTracks) => {
    if (curTracks.length === 0) { return }
    const unprocessedTracks = curTracks.filter(track => !track.processed)
    if (unprocessedTracks.length === 0) { return }
    const unprocessedTrackIds = unprocessedTracks.map(track => track.id)

    // TODO: rather than process the full list, send them off in batches of 5
    const params = {
      track_ids: unprocessedTrackIds
    }
    fetch(`/api?do=processTracks`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const newTracks = []
        // processing is slow, so we can't just copy over the current track list
        // loop through current tracks and update any that have been processed
        // otherwise keep what is already there
        for (const track of tracks) {
          const processedIdx = res.findIndex(x => x.id === track.id)
          newTracks.push(
            processedIdx !== -1 ? res[processedIdx] : track
          )
        }
        setTracks(newTracks)
      })
  }, [tracks, setTracks])

  const fetchPlaylists = useCallback((playlistSearchTerm) => {
    setPlaylistSearchTerm(playlistSearchTerm)
    setTracks([])
    setPassingTracks([])
    setFailingTrackIds([])
    setUserPlaylists([])
    setPlaylists([])

    fetch(`/api?do=getPlaylists&term=${encodeURIComponent(playlistSearchTerm)}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("fetchPlaylists res: ", res)
        setPlaylists(res)
      })
  }, [setPlaylistSearchTerm, setTracks, setPlaylists])

  const fetchUserPlaylists = useCallback(() => {
    setTracks([])
    setPassingTracks([])
    setFailingTrackIds([])
    setPlaylists([])
    setUserPlaylists([])
    fetch(`/api?do=getUserPlaylists`)
      .then((res) => res.json())
      .then((res) => {
        console.log("fetchUserPlaylists res: ", res)
        setUserPlaylists(res)
      })
  }, [setUserPlaylists])

  const fetchTracks = useCallback((pid, playlistName) => {
    setPlaylistName(playlistName)
    setIsProcessing(true)
    setPid(pid)
    // clear current track list
    setTracks([])
    setPassingTracks([])
    setFailingTrackIds([])
    fetch(`/api?do=getTracksOnly&pid=${encodeURIComponent(pid)}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("fetchTracks res: ", res)
        setTracks(res)
        processTracks(res)
      })
  }, [setPlaylistName, setIsProcessing, setPid, setTracks, setPassingTracks, setFailingTrackIds, setTracks])

  const applyFilters = useCallback((tracks, allowedCount) => {
    const params = {
      track_ids: tracks.map((track) => track.id),
      allow_no_lyrics: allowNoLyrics,
      allow_instrumental: allowInstrumental,
      allowed_count: allowedCount,
    }
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
  }, [setFailingTrackIds, setPassingTracks])


  const logoutUser = useCallback((email) => {
    fetch(`/api?do=logout&email=${encodeURIComponent(email)}`)
      .then(() => {
        console.log('logout attempt')
        setAccessToken("")
        setName("")
        setEmail("")
        setUserPlaylists([])
      })
      .catch((err) => {
        console.log("logoutUser ERROR: ", err)
      })
  }, [setAccessToken, setName, setEmail])

  return (
    <section className="page">
      <div id="container">
        {/* LEFT SIDEBAR ------ */}
        <div id="left-sidebar">
          {/* Logo */}
          <div id="logo-wrapper"><div id="logo">
            <span>SafeSound</span>
            <span>SafeSound</span>
          </div></div>

          {/* Search */}
          <PlaylistSearch fetchPlaylists={fetchPlaylists} />

          {access_token && (<ShowUserPlaylists fetchUserPlaylists={fetchUserPlaylists} />)}

          {/* User Playlists */}
          {userPlaylists.length ? (
            <UserPlaylists
              userPlaylists={userPlaylists}
              pid={pid}
              setPid={setPid}
              setPlaylistName={setPlaylistName}
              fetchTracks={fetchTracks}
            />
          ) : null}

          {/* Search Results Playlists */}
          {playlists.length ? (
            <ShowPlaylists
              playlists={playlists}
              pid={pid}
              setPid={setPid}
              setPlaylistName={setPlaylistName}
              setTracks={setTracks}
              fetchTracks={fetchTracks}
            />
          ) : null}
        </div>

        {/* CENTER COLUMN ------ */}
        <div id="main-block">

          {/* HEADER ------ */}
          <div id="header-block">
            {access_token ?
              <Logout name={name} logoutUser={logoutUser} /> :
              <SpotifyLogin logoutUser={logoutUser} />
            }
            <br /><br />
          </div>

          <div id="center-block">
            <div id="filters">
              <div>
                <AllowNoLyrics
                  allowNoLyrics={allowNoLyrics}
                  setAllowNoLyrics={setAllowNoLyrics}
                />
                &nbsp; &nbsp; &nbsp;
                <AllowInstrumental
                  allowInstrumental={allowInstrumental}
                  setAllowInstrumental={setAllowInstrumental}
                />
              </div>
              {access_token && tracks ? <SavePlaylist
                tracks={tracks}
                failingTrackIds={failingTrackIds}
                access_token={access_token}
                username={name}
                playlistName={playlistName}
                pid={pid}
                setPid={setPid}
                setIsError={setIsError}
              /> : null}
              {pid ? (
                <ShowTracks
                  pid={pid}
                  fetchTracks={fetchTracks}
                  playlistName={playlistName}
                />
              ) : null}
              {tracks.length ? <ApplyFilters tracks={tracks} applyFilters={applyFilters} /> : null}
            </div>


            {/* Featured Playlists */}
            {!pid && (
              <ShowFeaturedPlaylists
                setPid={setPid}
                setPlaylistName={setPlaylistName}
                setTracks={setTracks}
              />
            )}

            {/* Tracks */}
            {pid && playlistName ?
              <Tracks
                tracks={tracks}
                failingTrackIds={failingTrackIds}
                playlistName={playlistName}
                isProcessing={isProcessing}
              /> : null}

            {/* Spotify Player
              {access_token && deviceId && tracks.length ? 
              <SpotPlayer playbackToggle={playbackToggle} setPlaybackToggle={setPlaybackToggle} access_token={access_token} webplayer={webplayer} deviceId={deviceId} playstate={playstate} isPaused={isPaused} curTrackId={curTrackId} />
              : null}
              {/* add to spotplayer later playlist={playlist} */}
          </div>
        </div>
      </div>
    </section>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))

export default App
