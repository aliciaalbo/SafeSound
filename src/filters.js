import React from 'react';

function Filters(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.applyFilter(props.filter);
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>profanity</span></button>
    )
}

export default Filters;