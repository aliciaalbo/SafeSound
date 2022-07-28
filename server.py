# from crud import filter_cache_check
from flask import (Flask, render_template, request, session, redirect, jsonify)
from flask_session import Session
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

Session(connect_to_db(app))

SPOTIPY_REDIRECT_URI = secret.spotifyredirect
client_credentials_manager = SpotifyClientCredentials(client_id=secret.cid, client_secret=secret.secret)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
SCOPE = 'user-read-email playlist-modify-public streaming user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify user-read-currently-playing'
# copied from: https://github.com/plamere/spotipy/blob/master/examples/app.py
# cache_handler = spotipy.cache_handler.FlaskSessionCacheHandler(session)
auth_manager = SpotifyOAuth(secret.cid, secret.secret, SPOTIPY_REDIRECT_URI, scope=SCOPE, cache_path=None)

@app.route('/')
def show_homepage():
    """show homepage"""
    return render_template('homepage.html')

@app.route('/api', methods=['GET', 'POST'])
def parse_api():
    """catches and parses data from external api call and runs appropriate functions"""
    do = request.args.get('do')
    if do == "getInfo":
        if auth_manager.validate_token(session.get('token_info')):
            access_token = session.get('access_token')
            if (access_token):
                user = crud.get_user_by_access_token(access_token)
                if not user:
                    session.clear()
                    access_token = ""
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
    elif do == "getProcessingTracks":
        processing_tracks = session.get('processing_tracks')
        if processing_tracks is None:
            return jsonify([])
        return jsonify(processing_tracks)
    elif do == "getTracks":
        track_data = []
        # session['processing_tracks'] = track_data
        pid = request.args.get('pid')
        if pid is None or pid == "":
            return jsonify([])
        print("getTracks pid: ", pid)
        res = crud.fetch_playlist_tracks_data(pid)
        # bail if Spotify loading error
        if res is None:
            return jsonify([])
        if "items" in res:
            track_res = res['items']
        else:
            track_res = res
        # print("getTracks valid res: ", res['items'])
        data = {}

        for track in track_res:
            if data == {}:
                print(track)
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
                        instrumentalness = None,
                        bad_words_count = -1,
                    )
                    if track:
                        # fetch and store the lyrics if not in db
                        crud.get_words_of_lyrics(track)
                track_data.append(data)
                session['processing_tracks'] = track_data
            except Exception as e:
                print(e)
                continue
            # except(TypeError):
            #     print("type error", TypeError)
            #     continue
        # print(track_data)
        # session.pop('processing_tracks')
        return jsonify(track_data)
    elif do == "filterTracks":
        # get_json() is required for parsing JSON sent via POST instead of GET
        # need to send via POST because too much data for a GET string
        all_tracks_ids = request.get_json().get('track_ids')
        allow_no_lyrics = request.get_json().get('allow_no_lyrics')
        allowed_count = int(request.get_json().get('allowed_count'))
        passing_track_ids = []
        failing_track_ids = []
        EMPTY_WORD_LIST = ['nolyrics']
        for track_id in all_tracks_ids:
            # flush=True is a cool trick to force printing to the Flask console so we can see data directly
            #print(track, flush=True)
            # if filter_cache_check(track['id'], 1):
            #     print("match found")
            #     if crud.get_cached_results(track['id'], 1):
            #         passing_tracks.append(track)
            #         print("appended")
            track = crud.get_track_info(track_id)
            if track is not None:
                # this is slow because it loads lyrics from genius, parses and saves the word counts and updates bad_words_count
                # word_list = crud.get_words_of_lyrics(track)
                # check against filters or pass if plan
                """ WORD COUNT SHOULD BE A FLAG ON THE TRACK SO THIS FILTER WORKS WITHOUT LOADING ALL WORDS """
                # if word_list == EMPTY_WORD_LIST and allow_no_lyrics is True:
                    # passing_track_ids.append(track)
                    # pass
                # must have a word count (-1 means unprocessed, fail by default) and below threshold
                if track.bad_words_count != -1 and track.bad_words_count <= allowed_count:
                    # passing_track_ids.append(track)
                    pass
                else:
                    failing_track_ids.append(track_id)

        return jsonify(failing_track_ids)
    elif do == "savePlaylist":
        all_tracks = request.get_json().get('track_ids')
        failing_track_ids = request.get_json().get('failing_track_ids')
        track_ids = []
        for track in all_tracks:
            if track not in failing_track_ids:
                track_ids.append(track)
        access_token = request.args.get('access_token')
        username = request.args.get('username')
        title = request.args.get('title')
        playlist_name = f"{username}'s clean {title}"
        if (access_token):
            user = crud.get_user_by_access_token(access_token)
            sp = spotipy.Spotify(auth_manager=auth_manager)
            plist = sp.user_playlist_create(user.spotify_id, playlist_name)
            print("server savePlaylist route, user playlist: ", plist)
            sp.playlist_add_items(plist['id'], track_ids)
            print("Playlist added: ", plist['id'])
            return jsonify(plist['id'])
        return ""           
        # pass        




# return redirect('/')


@app.route('/callback')
def get_email_and_token():
    if request.args.get('code'):
        #token = crud.get_spotify_token(request.args.get('code'))
        token_info = auth_manager.get_access_token(request.args.get('code'), check_cache=False)
        session['token_info'] = token_info
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
    app.run(host='0.0.0.0', debug=False)
