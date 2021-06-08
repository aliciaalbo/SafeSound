# from flask import (Flask, render_template, request, flash, session, redirect, jsonify)
from model import connect_to_db
import crud
import model
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import secrets
import os

# app = Flask(__name__)
# app.secret_key = secrets.secret_key
# app.jinja_env.undefined = StrictUndefined

# connect_to_db(app)

cid = secrets.cid
secret = secrets.secret
client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)



def search_for_playlists(term):
    """searches Spotify for playlists, returns playlists"""
    playlists = spotify.search(term, type='playlist')
    playlist_data = {}

    for item in playlists:
        playlist_data[item]['id'] = [item]['name']

    return print(playlist_data)

def get_song_titles():
    """get song titles and id's from Spotify playlist"""



