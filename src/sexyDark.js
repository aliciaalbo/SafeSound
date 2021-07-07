import React from 'react';

function SexyDark(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.deactivateFilter('sexy');
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>sexy off</span></button>
    )
}


export default SexyDark;