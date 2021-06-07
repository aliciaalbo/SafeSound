

from model import db, connect_to_db, User, DefaultFilter, CustomFilter
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

def create_custom_filter(user_id, filter_name):
    """creates empty custom filter"""
    custom_filter = CustomFilter(
        user_id = user_id,
        filter_name = filter_name
    )

    db.session.add(custom_filter)
    db.session.commit()

# def update_custom_filter(custom_filter_id, word):


