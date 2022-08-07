import React from 'react';

function AllowNoLyrics(props){
    return (
        <label>
            <input
                id="allow_no_lyrics"
                type="checkbox"
                defaultChecked={props.allowNoLyrics}
                onChange={() => props.setAllowNoLyrics(!props.allowNoLyrics)}
            />
            Allow songs with no lyrics?
        </label>
        // <button variant="dark" className="btn btn-secondary m-1" onClick={e => { handleClick(e) }}>
        //     <span>Allow songs with no lyrics?</span>
        // </button>
    )
}


export default AllowNoLyrics;