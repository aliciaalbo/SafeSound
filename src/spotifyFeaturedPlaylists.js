import React, {useState, useEffect} from 'react';
import useStickyState from './useStickyState';

function ShowFeaturedPlaylists(props){
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(null);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);

  useEffect(() => {
    fetch(`/api?do=getFeaturedPlaylists`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((res) => {
      setFeaturedPlaylists(res);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    })
    .finally(() => {
      setLoading(false);
    });

    // clear state on close
    return () => {
      setFeaturedPlaylists([]);
    }
  }, []);

  if(loading) return "Loading...";
  if(error) return "Error: " + error;

  const handleClick = (e, key) => {
      e.preventDefault();
      props.setPid(key)
      console.log("pid set")
      console.log(key)
  };

  const handleDoubleClick = (e) => {
      e.preventDefault()
  }

  return(
    <div id="featured-playlists" class="playlist">
      <div className="playlist-header">Featured Playlists</div>
      {featuredPlaylists !== [] ? 
      featuredPlaylists.map((playlist, index) => {
      // const rowclasses = playlist.id;
      // className={rowclasses}
      const playlistNum = index+1;
      return (
      <div className="playlist-row" id={playlist.id} idx={index} key={playlist.id} onClick={e => { handleClick(e, playlist.id) }} onDoubleClick={e => { handleDoubleClick(e) }}>
         <div className="playlist-number col-auto my-auto">{playlistNum}</div>
         <div className="playlist-album col-auto my-auto"><img src={playlist.art} width="100" /></div>
         <div className="playlist-trackinfo col my-auto">
          <div className="playlist-title">{playlist.name}</div>
          <div className="playlist-artist">{playlist.description}</div>
         </div>
       </div>
         )}
       )
      : null}
    </div>
  );

}
    
export default ShowFeaturedPlaylists;
