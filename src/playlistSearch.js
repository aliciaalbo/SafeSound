import React from 'react';

function PlaylistSearch(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        props.fetchPlaylists(e.target.playlistSearchTerm.value);
    };
    
    return (
        <div className="searchbar">
          <form variant="dark" className="search-form" onSubmit={e => { handleSubmit(e) }}>
        <div className="">
          <input variant="dark" type="text" className="form-control" name="playlistSearchTerm" defaultValue={props.zipcode} placeholder="Search for Playlists" required />
          <div className="input-group-append">
            <button variant="dark" className="" type="submit">
            <span>Search for Playlists</span>
            </button>
          </div>
        </div>
          </form>
        </div>
      
      
        );
}

export default PlaylistSearch;