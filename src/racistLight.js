import React from 'react';

function RacistLight(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.activateFilter('racist');
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>racist off</span></button>
    )
}


export default RacistLight;