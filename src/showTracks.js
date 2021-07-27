import React from 'react';

function ShowTracks(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.fetchTracks(props.pid);
        
    };
    return (
        <button variant="dark" className="btn btn-secondary" onClick={e => { handleClick(e) }}>
            <span>show tracks</span>
        </button>
    )
}


export default ShowTracks;