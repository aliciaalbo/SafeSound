import React from 'react';

function SexyDark(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.deactivateFilter('sexy');
        console.log('toggled');
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>sexy on</span></button>
    )
}


export default SexyDark;