

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

# for custom filters
# def add_filter_term(filter_id, term):
#     """adds word or phrase to filter criteria"""



def find_song_lyrics(title):
    """searches genius for single title and returns lyrics as string"""

def find_playlist_lyrics(playlist_id):
    """searches genius for batch of songs, returns dictionary(? tbd)"""

def create_lyrics(lyrics, track_id):
    """creates a set of unique words in lyrics and returns them as a string separated by line breaks"""
    unique_lyrics = set()
    for word in lyrics:
        unique_lyrics.add(word)
    return "\n".join(list(unique_lyrics))

def save_lyrics(unique_lyrics, track_id, artist, album_art):
    """saves unique words in lyrics as string separated by line breaks with track info"""
    cached_lyrics = CachedLyrics(
                    unique_lyrics = unique_lyrics
                    track_id = track_id
                    artist = artist
                    album_art = album_art
    )
    db.session.add(cached_lyrics)
    db.session.commit()


def apply_filter(filter_id, lyrics):
    """checks for exact match of excluded terms, returns boolean"""
        words = "/n".split(lyrics)
    check_words = db.session.query(Filter.word_list).filter(Filter.filter_id).all()
    for word in check_words:
        if word in words:
            return False
    return True


def save_status(track_id, filter_id):
    """saves pass/fail status of track for chosen filter"""




def search_for_playlists(search_term):
    """searches Spotify for playlists and returns top 50"""
    return spotify.search(search_term, type="playlist")


# refactor to get title, atrist, art, track id  
# def get_song_info(playlist_id):
#     """get song titles and id's from Spotify playlist"""
#     response = spotify.playlist_items(playlist,
#                                     fields='items.track.id,items.track.name,items.track.artists,items.track.album,total',
#                                     additional_types=['track'])
#     for track in response['items']:
#         try:
#             tracks.append(track['track']['id'])
#             titles.append(track['track']['name'])
#             album_arts.append(track['track']['album']['images'][0]['url'])
#             artist_name = ''
#             for artist in track['track']['artists']:
#                 # print(artist)
#                 # print(artist['name'])
#                 # try:
#                 if artist_name == '':
#                     # print(artist['name'])
#                     artist_name = artist['name']   
#                 else:
#                     artist_name = artist_name + ', ' + artist['name']
#             artists.append(artist_name)

#         except(TypeError):
#             continue    
    





