import React, {useState} from 'react';


function UserPlaylists(props) {
    const handleClick = (e, pid, playlistName) => {
        e.preventDefault();
        // props.setPid(key)
        props.fetchTracks(pid, playlistName)
        console.log("user playlist set: ", pid)
    };

    const handleDoubleClick = (e) => {
        e.preventDefault()
    }
    

    return(
      <div id="my-playlists" className="playlist">
      <div className="playlist-header">My Playlists</div>
      {props.userPlaylists.map((playlist, index) => {
        const rowclasses = playlist.id;
        const playlistNum = index+1;
        return (
          <div className={rowclasses} id={playlist.id} idx={index} key={playlist.id} onClick={e => { handleClick(e, playlist.id, playlist.name) }}>
            <div className="playlist-number col-auto my-auto">{playlistNum}</div>
            <div className="playlist-album col-auto my-auto"><img src={playlist.art} width="100" /></div>
            <div className="playlist-trackinfo col my-auto">
              <div className="playlist-title">{playlist.name}</div>
              <div className="playlist-artist">{playlist.description}</div>
            </div>
          </div>
        )}
      )}
    </div>
    );
}

export default UserPlaylists;