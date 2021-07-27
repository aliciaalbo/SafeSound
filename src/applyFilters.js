import React from 'react';

function ApplyFilters(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.applyFilters(props.tracks);
        
    };
    return (
        <button variant="dark" className="btn btn-secondary" onClick={e => { handleClick(e) }}>
            <span>apply filters</span>
        </button>
    )
}


export default ApplyFilters;