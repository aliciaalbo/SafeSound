import { useEffect, useState } from 'react'

function Tracks(props) {
  // const [processingTracks, setProcessingTracks] = useState([], "processingTracks")

  // const fetchProcessingTracks = () => {
  //   fetch(`/api?do=getProcessingTracks`)
  //   .then((res) => res.json())
  //   .then((res) => {
  //     setProcessingTracks(res)
  //   });
  // }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (props.isProcessing) {
  //       fetchProcessingTracks();
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 3000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [props.isProcessing]);

  // const currentTracks = props.isProcessing ? processingTracks : props.tracks

  return (
    <>
      <div className="tracks-header">
        {props.playlistName}
      </div>
      <div id="show-tracks" className="tracks">
        {props.tracks.length > 0 && (
          props.tracks.map((track, index) => {
            const isFail = props.failingTrackIds.some(failingTrackId => failingTrackId === track.id)
            const rowClass = isFail ? "fail-playlist-row" : "playlist-row"
            const songNum = index + 1;
            return (
              <div className={rowClass} id={track.id} idx={index} key={track.id}>
                <div className="playlist-number col-auto my-auto">{songNum}{track.processed ? "" : "?"}</div>
                <div className="playlist-album col-auto my-auto"><img src={track.art} width="100" /></div>
                <div className="playlist-trackinfo col my-auto">
                  <div className="playlist-title">{track.title}</div>
                  <div className="playlist-artist">{track.artist}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}

export default Tracks