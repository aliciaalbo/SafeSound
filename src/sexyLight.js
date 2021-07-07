import React from 'react';

function SexyLight(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.activateFilter('sexy');
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>sexy off</span></button>
    )
}


export default SexyLight;