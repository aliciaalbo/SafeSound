import React from 'react';

function Tracks(props) {
  return (
    <div id="show-tracks" className="tracks">
     <div className="tracks-header">SHOULD BE PLAYLIST TITLE: Tracks</div>
      {props.tracks.map((track, index) => {
        const rowclasses = track.id;
        const songNum = index+1;
        return (
      <div className="playlist-row" id={track.id} idx={index} key={track.id}>
        <div className="playlist-number col-auto my-auto">{songNum}</div>
        <div className="playlist-album col-auto my-auto"><img src={track.art} width="100" /></div>
        <div className="playlist-trackinfo col my-auto">
          <div className="playlist-title">{track.title}</div>
          <div className="playlist-artist">{track.artist}</div>
        </div>
     </div>
        )}
      )}
    </div>
  );
}

export default Tracks;