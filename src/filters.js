import React from 'react';

function Filters(props){
    const handleClick = (e) => {
        e.preventDefault();
        props.applyFilter(props.filter);
    };
    return (
        <div>
            <profanity />
        </div>
    )
}

export default Filters;