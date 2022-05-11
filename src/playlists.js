import React, {useState} from 'react';
// import { useClickPreventionOnDoubleClick } from './use-click-prevention-on-double-click';



function ShowPlaylists(props) {
    const handleClick = (e, key, playlistName) => {
        e.preventDefault();
        props.setPid(key)
        props.setPlaylistName(playlistName)
        console.log("pid set")
        console.log(key)
    };

    const handleDoubleClick = (e) => {
        e.preventDefault()
    }
    
    // className="playlist container">
    return(
    <div id="search-playlists" className="playlist">
      <div className="playlist-header">Search Results</div>
      {props.playlists.map((playlist, index) => {
        const rowclasses = playlist.id;
        const playlistNum = index+1;
        return (
      <div className="playlist-row" id={playlist.id} idx={index} key={playlist.id} playlistName={playlist.name} onClick={e => { handleClick(e, playlist.id) }} onDoubleClick={e => { handleDoubleClick(e) }}>
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

export default ShowPlaylists;