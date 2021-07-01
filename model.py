from flask_sqlalchemy import SQLAlchemy
# import psycopg2
import secrets

db = SQLAlchemy()

class User(db.Model):
    """stores user data"""
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String)
    name = db.Column(db.String)
    spotify_id = db.Column(db.String)
    access_token = db.Column(db.String)
    refresh_token = db.Column(db.String)


class Filter(db.Model):
    """stores values for lyrics to exclude"""
    __tablename__ = "filters"

    filter_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    filter_name = db.Column(db.String)
    word_list = db.Column(db.String)

    db.relationship(User, backref='filters')

class CachedResult():
    """store results of filters applied to individual songs"""
    __tablename__ = "cached_results"

    cached_result_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    track_id = db.Column(db.String)
    filter_id = db.Column(db.String, db.ForeignKey('filters.filter_id'))
    pass_status = db.Column(db.Boolean)

class CachedLyrics():
    """stores unique words in lyrics"""
    __tablename__ = "cached_lyrics"

    track_id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String)
    artist = db.Column(db.String)
    album_art = db.Column(db.String)
    lyrics = db.Column(db.Text)



def connect_to_db(flask_app, db_uri='postgresql:///safesound', echo=True):
    # ignoring passed-in db_uri so it works on the server
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = secrets.db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
