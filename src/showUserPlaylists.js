import React from 'react';

function ShowUserPlaylists(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.fetchUserPlaylists();
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>browse my playlists</span></button>
    )
}


export default ShowUserPlaylists;