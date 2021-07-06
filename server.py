from flask import (Flask, render_template, request, flash, session, redirect, jsonify)
from jinja2 import StrictUndefined
from model import connect_to_db
import crud
# import model
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
import secrets
# import os

app = Flask(__name__)
app.secret_key = secrets.secret_key
app.jinja_env.undefined = StrictUndefined

connect_to_db(app)

cid = secrets.cid
secret = secrets.secret
SPOTIPY_REDIRECT_URI = secrets.spotifyredirect
client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
SCOPE = 'user-read-email playlist-modify-public streaming user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify user-read-currently-playing'
auth_manager = SpotifyOAuth(cid, secret, SPOTIPY_REDIRECT_URI, scope=SCOPE, cache_path=None )

@app.route('/')
def show_homepage():
    """show homepage"""

    return render_template('homepage.html')

@app.route('/api')
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
        search_term = request.args.get(term)
        res = crud.search_for_playlists(search_term)
        playlist_data = []
        # ids = []
        # art = []
        # title = []
        # description = []
        # All references working/correct, need to noodle on data structure a bit more
        for i, item in enumerate(res['playlists']['items']):
            data = {}
            data['id'] = item['id']
            data['description'] = item['description']
            data['name'] = item['name']
            data['art'] = item['images'][0]['url']
            playlist_data.append(data)

        return playlist_data
   



# def search_for_playlists(term):
#     """searches Spotify for playlists, returns playlists"""
#     playlists = spotify.search(term, type='playlist')
#     playlist_data = {}

#     for item in playlists:
#         playlist_data[item]['id'] = [item]['name']

#     return print(playlist_data)

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
