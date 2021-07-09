import React from 'react';

function ApplyFilters(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.fetchFilteredTacks(props.tracks);
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>apply filters</span></button>
    )
}


export default ApplyFilters;