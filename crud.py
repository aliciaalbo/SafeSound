

from model import db, connect_to_db, User, Filter
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
import secrets

cid = secrets.cid
secret = secrets.secret
client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def create_user(email, name, password):
    """add new user to database"""

    user = User(
        email = email,
        name = name,
        passwrod = password
    )

    db.session.add(user)
    db.session.commit()

def create_filter(user_id, filter_name):
    """creates empty filter"""
    filter = Filter(
        user_id = user_id,
        filter_name = filter_name
    )

    db.session.add(filter)
    db.session.commit()


def add_filter_term(filter_id, term):
    """adds word or phrase to filter criteria"""

def get_song_info(playlist):
    """get song titles and id's from Spotify playlist"""
    response = spotify.playlist_items(playlist,
                                    fields='items.track.id,items.track.name,items.track.artists,items.track.album,total',
                                    additional_types=['track'])
    for track in response['items']:
        try:
            tracks.append(track['track']['id'])
            titles.append(track['track']['name'])
            album_arts.append(track['track']['album']['images'][0]['url'])
            artist_name = ''
            for artist in track['track']['artists']:
                # print(artist)
                # print(artist['name'])
                # try:
                if artist_name == '':
                    # print(artist['name'])
                    artist_name = artist['name']   
                else:
                    artist_name = artist_name + ', ' + artist['name']
            artists.append(artist_name)

        except(TypeError):
            continue    
    
def cache_lyrics(lyrics, track_id):
    """creates a set of unique words in lyrics and returns them as a string"""
    unique_lyrics = set()
    for word in lyrics:
        unique_lyrics.add(word)
    return "\n".join(list(unique_lyrics))

# def update_custom_filter(custom_filter_id, word):


