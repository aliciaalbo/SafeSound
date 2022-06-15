import React from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function ApplyFilters(props){
    const handleSubmit = (e) => {
      e.preventDefault();
      props.applyFilters(props.tracks, e.target.badWordCount.value);
    };

    return (
      <div className="searchbar">
        <Form variant="dark" className="search-form" onSubmit={e => { handleSubmit(e) }}>
          <div className="input-group">
            <input variant="dark" type="text" className="form-control" name="badWordCount" defaultValue="" placeholder="Input number of bad words per song" required />
            <div className="input-group-append">
              <button variant="dark" className="btn btn-secondary" type="submit">
                Filter Tracks!
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
}


export default ApplyFilters;