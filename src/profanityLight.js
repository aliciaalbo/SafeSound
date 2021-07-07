import React from 'react';

function ProfanityLight(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.activateFilter('profanity');
        
    };
    return (
        <button className="btn-actions justify-content-center flex-nowrap" onClick={e => { handleClick(e) }}>
        <span>profanity off</span></button>
    )
}


export default ProfanityLight;