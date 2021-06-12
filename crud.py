

from model import db, connect_to_db, User, Filter
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
import secrets

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
    
def cache_lyrics(lyrics, track_id):
    """creates a set of unique words in lyrics and returns them as a string"""
    unique_lyrics = set()
    for word in lyrics:
        unique_lyrics.add(word)
    return "\n".join(list(unique_lyrics))

# def update_custom_filter(custom_filter_id, word):


