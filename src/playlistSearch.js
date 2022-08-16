import React from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function PlaylistSearch(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        props.fetchPlaylists(e.target.playlistSearchTerm.value);
    };
    
    return (
<div className="searchbar">
  <Form variant="dark" className="search-form" onSubmit={e => { handleSubmit(e) }}>
    <div className="input-group">
      <input id="playlist-search-input" variant="dark" type="text" className="form-control" name="playlistSearchTerm" defaultValue="" placeholder="Search for Playlists" required />
      <div className="input-group-append">
        <button variant="dark" className="btn btn-secondary dark-button" type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  </Form>
</div>
        );
}

export default PlaylistSearch;