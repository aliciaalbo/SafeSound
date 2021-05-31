from flask_sqlalchemy import SQLAlchemy
import psycopg2
import secrets

db = SQLAlchemy()

class User(db.Model):
    """stores user data"""
    __tablename = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String)
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    password = db.Column(db.String)

class User(db.Model):
    """stores user data"""
    __tablename = "users"


def connect_to_db(flask_app, db_uri='postgresql:///spotify03132021', echo=True):
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
