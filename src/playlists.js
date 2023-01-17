import React, { useState } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
// import { useClickPreventionOnDoubleClick } from './use-click-prevention-on-double-click'


function ShowPlaylists(props) {
  const handleClick = (e, key, playlistName) => {
    e.preventDefault();
    console.log("showPlaylists pid: ", key)
    props.setPid(key)
    props.setPlaylistName(playlistName)
    props.setTracks([])
  }

  const handleDoubleClick = (e) => {
    e.preventDefault()
  }

  // className="playlist container">
  return (
    <div id="search-playlists" className="sidebar-playlist">
      <div className="playlist-header">Search Results</div>
      {props.playlists.map((playlist, index) => {
        const rowclasses = playlist.id == props.pid ? "playlist-row-active" : "playlist-row"
        return (
          <div
            className={rowclasses}
            id={playlist.id}
            key={playlist.id}
            idx={index}
            playlistName={playlist.name}
            onClick={e => { handleClick(e, playlist.id, playlist.name) }}
            onDoubleClick={e => { handleDoubleClick(e) }}
          >
            {/* <OverlayTrigger
                delay={{ hide: 300, show: 300 }}
                overlay={(props) => (
                <Tooltip {...props}>
                    {playlist.description}
                </Tooltip>
                )}
                placement="auto"
            > */}
            {/* <div className="playlist-number col-auto my-auto">{playlistNum}</div>
              <div className="playlist-album col-auto my-auto"><img src={playlist.art} width="100" /></div> */}
            <div className="playlist-trackinfo col my-auto">
              <div className="playlist-title">{playlist.name}</div>
              {/* <div className="playlist-artist">{playlist.description}</div> */}
            </div>
            {/* </OverlayTrigger> */}
          </div>
        )
      }
      )}
    </div>
  )
}

export default ShowPlaylists