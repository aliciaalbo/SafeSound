import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';

function ShowTracks(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.fetchTracks(props.pid, props.playlistName);        
    };
    return (
        <OverlayTrigger
            delay={{ hide: 300, show: 300 }}
            overlay={(props) => (
            <Tooltip {...props}>
                Load and process for filtering all tracks in the playlist.
            </Tooltip>
            )}
            placement="auto"
        >
            <button variant="dark" className="btn btn-secondary" onClick={e => { handleClick(e) }}>
                <span>show tracks</span>
            </button>
        </OverlayTrigger>
    )
}


export default ShowTracks;