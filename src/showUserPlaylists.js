import React from 'react'

function ShowUserPlaylists(props) {
    const handleClick = (e) => {
        e.preventDefault();
        props.fetchUserPlaylists()

    };
    return (
        <button variant="dark" className="btn btn-secondary m-1" onClick={e => { handleClick(e) }}>
            <span>browse my playlists</span>
        </button>
    )
}


export default ShowUserPlaylists