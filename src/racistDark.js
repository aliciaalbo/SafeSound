import React from 'react';

function RacistDark(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.deactivateFilter('racist');
        console.log('toggled');
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>racist on</span></button>
    )
}


export default RacistDark;