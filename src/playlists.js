import React from 'react';

function ShowPlaylists(props) {


    return(
    <div className="playlist container">
      {props.playlists.map((playlist, index) => {
        const rowclasses = playlist.id;
        const playlistNum = index+1;
        return (
      <div className={rowclasses} id={playlist.id} idx={index} key={playlist.id}>
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