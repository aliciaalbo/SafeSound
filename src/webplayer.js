// import { useEffect, useRef } from 'react';

// function WebPlayer(props) {
//   // keeps the player from writing over itself
//   const playerRef = useRef(null);
//   const token = props.access_token;
//   const isReady = props.isReady;

//   console.log("deviceid passed to wp: ",props.deviceId);

//   // creates an instance of the player

//   // from pampaplay source code
//   useEffect(() => {
//    if (token) {
//     // already loaded, we are rolling a new token probably
//     if (window.Spotify) {
//       playerRef.current = new window.Spotify.Player({
//         name: 'SafeSound',
//         getOAuthToken: cb => {
//           console.log('cb at reroll:',token);
//           cb(token);
//         },
//       });
//       props.setIsReady(true);
//       console.log('reloading');
//     }

//     // this function is called by the Spotify script once it is dynamically loaded
//     window.onSpotifyWebPlaybackSDKReady = () => {
//       playerRef.current = new window.Spotify.Player({
//         name: 'SafeSound',
//         getOAuthToken: (cb) => {
//           console.log('cb at loading sdk first time:',token);
//           cb(token);
//         },
//       });
//       props.setIsReady(true);
//       //setOnReady(window.Spotify.PlaybackStateListener);
//       console.log('current set');
//     };

//     // needs to be added dynamically within React so the window.onSpotifyWebPlaybackSDKReady
//     // function is read to be called by the spotify-player.js after loading
//     if (!window.Spotify) {
//       const scriptTag = document.createElement('script');
//       scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
//       document.head.appendChild(scriptTag);
//       console.log('load script');
//     }
//     console.log('player details:',playerRef);
//    }
//   }, [props.setIsReady, token]);



//   // connect to Spotify once the player is created
//   useEffect(() => {
//     const player = playerRef.current;
//     // an async IIFE to immediate run a function, needed for await
//     (async () => {
//       if (isReady) {
//         player.addListener('account_error', e => {
//           console.log('account error:',e);
//         });
//         player.addListener('authentication_error', e => {
//           console.log('auth error:',e);
//         });
//         player.addListener('initialization_error', e => {
//           console.log('init error:',e);
//         });
//         player.addListener('not_ready', e => {
//           console.log('not ready:',e);
//         });
//         player.addListener('ready', ({ device_id: readyDeviceId }) => {
//           props.setDeviceId(readyDeviceId);
//           console.log('rdy deviceid', readyDeviceId);
//         });
//         player.addListener('player_state_changed', (state) => {
//           if (state) {
//             props.setIsPaused(state.paused);
//             props.setCurTrackId(state.track_window.current_track.id);
//           }
//         });
//         // now connect
//         let connected = await playerRef.current.connect();
//         if (connected) {
//           console.log('connected', connected, playerRef.current);
//         }
//       }
//     })();
//   }, [props, isReady]);

//   return {
//     player: playerRef.current
//   };
// }

// export default WebPlayer;