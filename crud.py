

from model import db, connect_to_db, User, DefaultFilters, CustomFilters
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


