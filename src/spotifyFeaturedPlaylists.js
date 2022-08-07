import React, {useState, useEffect} from 'react';
import Carousel from 'react-bootstrap/Carousel'  
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
  const handleClick = (e, playlistId, playlistName) => {
      e.preventDefault();
      props.setPid(playlistId)
      // props.setPlaylistName(playlistName)
      props.setPlaylistName(playlistName)
      // maybe should trigger loading automatically?
      props.setTracks([])
      console.log("featured playlist pid set ", playlistId)
  };

  const handleDoubleClick = (e) => {
      e.preventDefault()
  }

  return (
    <div id="featured-playlists" className="playlist">
      <div className="playlist-header">Featured Playlists</div>
      <div>
  {/* <div className='container-fluid'>
    <div className="row title" style={{ marginBottom: "20px" }} >
      <div className="col-sm-12 btn btn-warning">
        Spotify Featured Playlists
      </div>
    </div>
  </div> */}
    <Carousel fade={true}>
      {featuredPlaylists.map((playlist, index) => {
        return (
          <Carousel.Item
            key={playlist.id}
            onClick={e => { handleClick(e, playlist.id, playlist.name) }}
          >
            {/* <div style={{ margin:auto;maxWidth: "300px" }}> */}
            <div>
              <img className="d-block img-fluid"
                src={playlist.art}
              />
              <Carousel.Caption>
                <h3>{playlist.title}</h3>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        )
      })}
    </Carousel>
  </div>  
</div>  

  );

}
    
export default ShowFeaturedPlaylists;
