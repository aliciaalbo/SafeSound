import React, { useState } from 'react'


function UserPlaylists(props) {
  const handleClick = (e, pid, playlistName) => {
    e.preventDefault()
    props.setPid(pid)
    props.fetchTracks(pid, playlistName)
    console.log("user playlist set: ", pid)
  }

  const handleDoubleClick = (e) => {
    e.preventDefault()
  }

  return (
    <div id="my-playlists" className="sidebar-playlist">
      <div className="playlist-header">My Playlists</div>
      {props.userPlaylists.map((playlist, index) => {
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
            {/* <div className="playlist-number col-auto my-auto">{playlistNum}</div>
            <div className="playlist-album col-auto my-auto"><img src={playlist.art} width="100" /></div> */}
            <div className="playlist-trackinfo col my-auto">
              <div className="playlist-title">{playlist.name}</div>
              {/* <div className="playlist-artist">{playlist.description}</div> */}
            </div>
          </div>
        )
      }
      )}
    </div>
  )
}

export default UserPlaylists