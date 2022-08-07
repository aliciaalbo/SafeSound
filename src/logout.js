import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

function Logout(props) {
    const handleClick = (e) => {
        e.preventDefault();
        props.logoutUser(props.email);
    };
    return (
        <>
        <Dropdown>
            <Dropdown.Toggle
                variant="dark"
                className="btn btn-secondary m-1 rounded-pill"
            >
                <FontAwesomeIcon icon={faSpotify} size="1x" />
                <span>&nbsp; {props.name}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu variant="dark" className="dropdown-menu-dark">
                <Dropdown.Item onClick={e => { handleClick(e) }}>Log out</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        {/* <button variant="dark" className="btn btn-secondary m-1 rounded-pill" onClick={e => { handleClick(e) }}>
            <FontAwesomeIcon icon={faSpotify} size="1x" />
            <span>&nbsp; {props.name}</span>
        </button> */}
        </>
    )
}

export default Logout;
