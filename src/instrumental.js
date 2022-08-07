import React from 'react';

function AllowInstrumental(props){
    return (
        <span>
            <label>
                <input
                    id="include_instrumental"
                    type="checkbox"
                    defaultChecked={props.allowInstrumental}
                    onChange={() => props.setAllowInstrumental(!props.allowInstrumental)}
                />
                Include instrumental tracks?
            </label>
        </span>
    )
}


export default AllowInstrumental;