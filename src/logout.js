import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

function Logout(props) {
    const handleClick = (e) => {
        e.preventDefault();
        props.logoutUser(props.email);
    };
    return (
        <button variant="dark" className="btn btn-secondary m-1" onClick={e => { handleClick(e) }}>
        <FontAwesomeIcon icon={faSpotify} size="2x" />
        <span>&nbsp; Logout</span>
    </button>
    )
}

export default Logout;
