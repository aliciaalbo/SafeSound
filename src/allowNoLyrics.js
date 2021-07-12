import React from 'react';

function AllowNoLyrics(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.setAllowNoLyrics();
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>Allow songs with no lyrics?</span></button>
    )
}


export default AllowNoLyrics;