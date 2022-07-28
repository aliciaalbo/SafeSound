import { useEffect, useState }  from 'react';

function Tracks(props) {
  const [processingTracks, setProcessingTracks] = useState([], "processingTracks")

  const fetchProcessingTracks = () => {
    fetch(`/api?do=getProcessingTracks`)
    .then((res) => res.json())
    .then((res) => {
      setProcessingTracks(res)
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.isProcessing) {
        fetchProcessingTracks();
      } else {
        clearInterval(interval);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [props.isProcessing]);

  const currentTracks = props.isProcessing ? processingTracks : props.tracks

  return (
    <div id="show-tracks" className="tracks">
      {/* I want to clear the tracks while it's loading or not have
       the name update until the tracks are loaded what is the 
       best way to do it? I tried a delay but that sucks as is stupid */}
      <div className="tracks-header">
        {props.playlistName}
      </div>
      {props.isProcessing ? 
        <div>Processing tracks...</div> :
        currentTracks.length > 0 ?
          currentTracks.map((track, index) => {
            const isFail = props.failingTrackIds.some(failingTrackId => failingTrackId === track.id)
            const rowClass = isFail ? "fail-playlist-row" : "playlist-row"
            const songNum = index+1;
            return (
              <div className={rowClass} id={track.id} idx={index} key={track.id}>
                <div className="playlist-number col-auto my-auto">{songNum}</div>
                <div className="playlist-album col-auto my-auto"><img src={track.art} width="100" /></div>
                <div className="playlist-trackinfo col my-auto">
                  <div className="playlist-title">{track.title}</div>
                  <div className="playlist-artist">{track.artist}</div>
                </div>
              </div>
            )
          }) :
          <div>Click "show tracks" to load.</div>
    }
    </div>
  );
}

export default Tracks;