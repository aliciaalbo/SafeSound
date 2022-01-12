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

  const handleClick = (e, key) => {
      e.preventDefault();
      props.setPid(key)
      console.log("pid set")
      console.log(key)
  };

  const handleDoubleClick = (e) => {
      e.preventDefault()
  }

  return (
    <div id="featured-playlists" class="playlist">
      <div className="playlist-header">Featured Playlists</div>
      <div>
  <div class='container-fluid'>
    <div className="row title" style={{ marginBottom: "20px" }} >
      <div class="col-sm-12 btn btn-warning">
        Spotify Featured Playlists
      </div>
    </div>
  </div>

  {/* <div className='container-fluid' id={track.id} idx={index} key={track.id} onClick={e => { handleClick(e, track.id) }} onDoubleClick={e => { handleDoubleClick(e) }}> */}
    <Carousel fade="true">

    {featuredPlaylists.map((track, index) => {
      return (
        <Carousel.Item>
          <div style={{ maxWidth: "300px" }}>
            <img
              className="d-block img-fluid"
              src={track.art}
            />
            <Carousel.Caption>
              <h3>{track.title}</h3>
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
