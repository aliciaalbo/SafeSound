import React from 'react';

function ProfanityDark(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.deactivateFilter('profanity');
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>profanity on</span></button>
    )
}


export default ProfanityDark;