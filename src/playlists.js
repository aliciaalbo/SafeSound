import React, {useState} from 'react';
import { useClickPreventionOnDoubleClick } from './use-click-prevention-on-double-click';



function ShowPlaylists(props) {
    const handleClick = (e) => {
        e.preventDefault();
        // setSelectedPlaylist("playlist.id")
    };

    const handleDoubleClick = (e) => {
        e.preventDefault()
    }
    

    return(
    <div className="playlist container">
      {props.playlists.map((playlist, index) => {
        const rowclasses = playlist.id;
        const playlistNum = index+1;
        return (
      <div className={rowclasses} id={playlist.id} idx={index} key={playlist.id} onClick={e => { handleClick(e) }} onDoubleClick={e => { handleDoubleClick(e) }}>
        <div className="playlist-number col-auto my-auto">{playlistNum}</div>
        <div className="playlist-album col-auto my-auto"><img src={playlist.art} /></div>
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

export default ShowPlaylists;