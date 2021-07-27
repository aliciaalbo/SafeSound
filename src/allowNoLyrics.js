import React from 'react';

function AllowNoLyrics(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.setAllowNoLyrics();
        
    };
    return (
        <button variant="dark" className="btn btn-secondary" onClick={e => { handleClick(e) }}>
            <span>Allow songs with no lyrics?</span>
        </button>
    )
}


export default AllowNoLyrics;