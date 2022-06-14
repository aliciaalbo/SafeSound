import React from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function FilterLevel(props){
    const handleSubmit = (e) => {
        e.preventDefault();
        // props.applyFilter(e.target.badWordCount.value);
    };
    return (
        <div className="badWordCount">
          <Form variant="dark" className="bad-word-count" onSubmit={e => { handleSubmit(e) }}>
            <div className="input-group">
              <input variant="dark" type="text" className="form-control" name="badWordCount" defaultValue="" placeholder="0" required />
              <div className="input-group-append">
                <button variant="dark" className="btn btn-secondary" type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </Form>
        </div>
                );
}

export default FilterLevel;