import React from 'react';

function PlaylistSearch(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        props.fetchPlaylists(e.target.playlistSearchTerm.value);
    };
    
    return (
        <div className="searchbar">
          <Form variant="dark" className="search-form" onSubmit={e => { handleSubmit(e) }}>
        <div className="">
          <input variant="dark" type="text" className="form-control" name="playlistSearchTerm" defaultValue={props.zipcode} placeholder="Zip Code" required />
          <div className="input-group-append">
            <button variant="dark" className="btn btn-secondary" type="submit">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
          </Form>
        </div>
      
      
        );
}

export default PlaylistSearch;