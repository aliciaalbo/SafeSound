import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

function SavePlaylist(props) {
    const handleClick = (e) => {
        e.preventDefault();
        const tracks = props.tracks;
        props.setPid("");
        props.setIsError(false);
            fetch(`/api?do=savePlaylist&access_token=${encodeURIComponent(props.access_token)}&track_ids=${encodeURIComponent(tracks)}&failingTrackIds=${encodeURIComponent(props.failingTrackIds)}&username=${props.username}&title=${props.title}`)
            .then((res) => res.json())
            .then((pid) => {
                console.log("SavePlaylist new pid: ", pid);
                props.setPid(pid)
            })
            .catch((err) => {
                console.log("SavePlaylist ERROR: ",err);
                props.setIsError(true)
            });
        // }
    };
    // btn-actions justify-content-center flex-nowrap
    return (
        <button variant="dark" className="btn btn-primary m-1" onClick={e => { handleClick(e) }}>
            {/* <i className="fas fa-cloud-upload-alt fa-2x"></i> */}
            <span>Save Playlist on Spotify &nbsp;</span>
            <FontAwesomeIcon icon={faCloudUploadAlt} size="1x" />
        </button>
    )
}

export default SavePlaylist;
