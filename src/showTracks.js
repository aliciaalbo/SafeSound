import React from 'react';

function ShowTracks(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.fetchTracks(props.pid);
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>show tracks</span></button>
    )
}


export default ShowTracks;