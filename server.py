# from crud import filter_cache_check
from flask import (Flask, render_template, request, session, redirect, jsonify)
from jinja2 import StrictUndefined
from model import connect_to_db
import crud
import get_playlists
# import model
# import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
import secret
# import os

app = Flask(__name__)
app.secret_key = secret.secret_key
app.jinja_env.undefined = StrictUndefined

connect_to_db(app)

SPOTIPY_REDIRECT_URI = secret.spotifyredirect
client_credentials_manager = SpotifyClientCredentials(client_id=secret.cid, client_secret=secret.secret)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
SCOPE = 'user-read-email playlist-modify-public streaming user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify user-read-currently-playing'
auth_manager = SpotifyOAuth(secret.cid, secret.secret, SPOTIPY_REDIRECT_URI, scope=SCOPE, cache_path=None )

@app.route('/')
def show_homepage():
    """show homepage"""
    return render_template('homepage.html')

@app.route('/api', methods=['GET', 'POST'])
def parse_api():
    """catches and parses data from external api call and runs appropriate functions"""
    do = request.args.get('do')
    if do == "getInfo":
        access_token = session.get('access_token')
        if (access_token):
            user = crud.get_user_by_access_token(session.get('access_token'))
            return jsonify({ 'access_token': access_token, 'email': user.email, 'name': user.name })
        return jsonify({ 'access_token': "", 'email': "", 'name': "" })
    elif do == "logout":
        email = request.args.get('email')
        session.clear()
        if (email):
            return crud.logout(email)
        return "Could not logout, no access token"
    elif do == "getPlaylists":
        search_term = request.args.get('term')
        return get_playlists.get_playlists(search_term)
    elif do == "getFeaturedPlaylists":
        return get_playlists.get_featured_playlists()
    elif do == "getUserPlaylists":
        return get_playlists.get_user_playlists()
    elif do == "getTracks":
        pid = request.args.get('pid')
        print(pid)
        res = crud.fetch_playlist_tracks_data(pid)
        track_data = []
        for track in res['items']:
            data = {}
            try:
                data['id'] = track['track']['id']
                data['title'] = track['track']['name']
                data['art'] = track['track']['album']['images'][0]['url'] if track['track']['album']['images'] else ""
                artist_name = ''
                for artist in track['track']['artists']:
                    if artist_name == '':
                        artist_name = artist['name']   
                    else:
                        artist_name = artist_name + ', ' + artist['name']
                data['artist'] = artist_name
                data['explicit'] = track['track']['explicit']
                data['bad_words_count'] = -1
                # insert the track info if not already there
                if data['id']:
                    track = crud.insert_track_info(
                        track_id = data['id'],
                        title = data['title'] or '',
                        artist = data['artist'] or '',
                        album_art = data['art'] or '',
                        explicit = bool(data['explicit']),
                        bad_words_count = -1,
                    )
                    if track:
                        # get lyrics while we are here
                        crud.get_words_of_lyrics(track)


            except(TypeError):
                continue  
            track_data.append(data)  
        # print(track_data)
        return jsonify(track_data)
    elif do == "filterTracks":
        # get_json() is required for parsing JSON sent via POST instead of GET
        # need to send via POST because too much data for a GET string
        allow_no_lyrics = request.get_json().get('allowNoLyrics')
        all_tracks_ids = request.get_json().get('track_ids')
        allowed_count = int(request.get_json().get('allowed_count'))
        failing_track_ids = []
        empty_word_list = ['nolyrics']
        for track_id in all_tracks_ids:
            # flush=True is a cool trick to force printing to the Flask console so we can see data directly
            #print(track, flush=True)
            # if filter_cache_check(track['id'], 1):
            #     print("match found")
            #     if crud.get_cached_results(track['id'], 1):
            #         passing_tracks.append(track)
            #         print("appended")
            # elif crud.lyrics_cache_check_by_id(track['id']):
            #     lyrics = crud.get_lyrics_by_track_id(track['id'])
            #     lyrics_set = crud.parse_lyrics(lyrics)
            #     print("lyrics match found")
            #     if crud.apply_filter(lyrics_set, 1):
            #         passing_tracks.append(track)
            # else:
            track = crud.get_track_info(track_id)
            if track is not None:
                # this is slow because it loads lyrics from genius, parses and saves the word counts and updates bad_words_count
                word_list = crud.get_words_of_lyrics(track)
                # check against filters or pass if plan
                if word_list == empty_word_list and allow_no_lyrics is True:
                    # passing_track_ids.append(track)
                    pass
                # -1 means unprocessed, fail by default
                elif track.bad_words_count != -1 and track.bad_words_count <= allowed_count:
                    # passing_track_ids.append(track)
                    pass
                else:
                    failing_track_ids.append(track_id)

        return jsonify(failing_track_ids)


        # pass        




# return redirect('/')


@app.route('/callback')
def get_email_and_token():
    if request.args.get('code'):
        #token = crud.get_spotify_token(request.args.get('code'))
        token_info = auth_manager.get_access_token(request.args.get('code'), check_cache=False)
        spotify = spotipy.Spotify(auth_manager=auth_manager)
        email = spotify.me()["email"]
        name = spotify.me()["display_name"]
        spotify_id = spotify.me()["id"]
        refresh_token = token_info['refresh_token']
        access_token = token_info['access_token']
        # set the access token in a session cookie so it will persist and can be grabbed by React through an API call
        session['access_token'] = access_token

        if crud.get_user_by_email(email):
            # Do something to login.. send access token to react? 
            # then if access toekn show save playlist buttn that isn't made yet
            crud.update_access_token(email, access_token)
            crud.update_refresh_token(email, refresh_token)
        else:
            crud.create_user(email, name, spotify_id, access_token, refresh_token)

        # set the access token cookie for React
        #response = redirect('/', 302)
        # secure=True only if using https, otherwise it won't set the cookie
        #response.set_cookie('access_cookie', access_token, secure=False, httponly=False)
        #return response

    # email = sp.user(email)
    # pprint.pprint(email)
    # # token = crud.get_spotify_credentials(code)
    return redirect('http://localhost:3000')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
