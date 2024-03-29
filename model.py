from flask_sqlalchemy import SQLAlchemy
import secret

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

# I might nopt need this either, can do on the fly with counts not that slow
# but might want to save values in state? 
class Filter(db.Model):
    """stores values for lyrics to exclude"""
    __tablename__ = "filters"

    filter_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    filter_name = db.Column(db.String)
    word_list = db.Column(db.String)

    db.relationship(User, backref='filters')


# Dont need this with the calculated column in tracks
# class CachedResult(db.Model):
#     """store results of filters applied to individual songs"""
#     __tablename__ = "cached_results"

#     cached_result_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     track_id = db.Column(db.String)
#     filter_id = db.Column(db.Integer, db.ForeignKey('filters.filter_id'))
#     pass_status = db.Column(db.Boolean)

class CachedLyrics(db.Model):
    """stores count of each word in song lyrics"""
    __tablename__ = "cached_lyrics"

    cached_lyrics_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    track_id = db.Column(db.String, db.ForeignKey('tracks.track_id'))
    word = db.Column(db.String)
    word_count = db.Column(db.Integer)


class Lyrics(db.Model):
    """stores lyrics as a string"""
    __tablename__ = "lyrics"

    lyrics_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    track_id = db.Column(db.String, db.ForeignKey('tracks.track_id'))
    lyrics = db.Column(db.Text)


class Tracks(db.Model):
    """stores track data"""
    __tablename__ = "tracks"

    track_id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String)
    artist = db.Column(db.String)
    album_art = db.Column(db.String)
    explicit = db.Column(db.Boolean)
    bad_words_count = db.Column(db.Integer)
    instrumentalness = db.Column(db.Float)
    
    db.relationship(CachedLyrics, backref='tracks')


# echo = True to show DB calls
def connect_to_db(flask_app, db_uri='postgresql:///safesound', echo=False):
    # ignoring passed-in db_uri so it works on the server
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = secret.db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
