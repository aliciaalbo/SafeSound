import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

function SavePlaylist(props) {
    const handleClick = (e) => {
        e.preventDefault();
        props.setPid("");
        const params = {
            track_ids: props.tracks.map((track) => track.id),
            access_token: props.access_token,
            failing_track_ids: props.failingTrackIds,
            username: props.username,
            playlist_name: props.playlistName,
        };
        props.setIsError(false);
            fetch("/api?do=savePlaylist", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            })
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
