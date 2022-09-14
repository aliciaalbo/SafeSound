from model import db, User, Filter, CachedLyrics, Tracks, Lyrics
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
# import os
import secret
import lyricsgenius
import re
from bad_words import bad_words

client_credentials_manager = SpotifyClientCredentials(client_id=secret.cid, client_secret=secret.secret)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
#genius = lyricsgenius.Genius(remove_section_headers=True, retries=3)
#genius.remove_section_headers = True
#genius.retries = 3

def create_user(email, name, spotify_id, access_token, refresh_token):
    """add new user to db and stores their tokens"""

    user = User(email = email,
                name = name,
                spotify_id = spotify_id,
                access_token = access_token,
                refresh_token = refresh_token)

    db.session.add(user)
    db.session.commit()
    return user


def logout(email):
    """logs user out of spotify by deleting their tokens"""
    if (email):
        user = get_user_by_email(email)
        print("logout user: ", user)
        if user is not None:
            update_access_token(user.email, "")
            update_refresh_token(user.email, "")
            db.session.add(user)
            db.session.commit()
        return "Logout successful"
    return "Could not logout, no access token"

def get_user_by_access_token(access_token):
    if access_token is None or access_token == "":
        return None
    return User.query.filter(User.access_token == access_token).one_or_none()

def get_user_by_email(email):
    """Gets a user by email"""
    if email is None or email == "":
        return None
    return User.query.filter(User.email == email).one_or_none()

def get_access_token_by_email(email):
    """retrieves access token from db by email lookup"""
    if email is None or email == "":
        return None
    return User.query(User.access_token).filter(User.email == email).one_or_none()

def get_refresh_token_by_email(email):
    """retrieves access token from db by email lookup"""
    if email is None or email == "":
        return None
    return User.query(User.refresh_token).filter(User.email == email).one_or_none()

def update_access_token(email, access_token):
    """updates a user's spotify access token"""
    if email is None or email == "" or access_token is None or access_token == "":
        return None
    user = User.query.filter(User.email == email).one_or_none()
    if user is None:
        return None
    user.access_token = access_token
    db.session.add(user)
    db.session.commit()

    return user


def update_refresh_token(email, refresh_token):
    """updates a user's spotify access token"""
    if email is None or email == "" or refresh_token is None or refresh_token == "":
        return None
    user = User.query.filter(User.email == email).one_or_none()
    if user is None:
        return None
    user.refresh_token = refresh_token
    db.session.add(user)
    db.session.commit()

    return user

# NOT CALLED
# def get_spotify_token(code):
#     SPOTIPY_REDIRECT_URI = secret.spotifyredirect
#     SCOPE = 'user-read-email playlist-modify-public streaming user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify user-read-currently-playing playlist-read-private'

#     # CacheDBHandler is a custom class you need to write to store and retrieve cache in the DB, in cachedb.py
#     auth_manager = SpotifyOAuth(secret.cid, secret.secret, SPOTIPY_REDIRECT_URI, scope=SCOPE, cache_path=None)
#     # ignore cache until make it work
#     token_info = auth_manager.get_access_token(code, check_cache=False)
#     return token_info

# NOT CALLED
# def get_spotify_credentials(code):
#     """submits authorization code to spotify to get token and user email"""

#     # https://github.com/plamere/spotipy/blob/master/spotipy/util.py
#     # http://www.acmesystems.it/python_httpd

#     # query db for access
#     # check id fresh
#     # if yes save play list
#     SPOTIFY_REDIRECT_URI = secret.spotifyredirect
#     SCOPE = 'web-playback user-read-email playlist-modify-public streaming user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify user-read-currently-playing'
#     CACHE = '.spotipyoauthcache'

#     # CacheDB is a custom class you need to make to store the cache in the DB
#     sp_oauth = SpotifyOAuth(secret.cid, secret.secret, SPOTIFY_REDIRECT_URI, scope=SCOPE, cache_handler="CacheDB" )
#     #sp_oauth = oauth2.SpotifyPKCE(secret.cid,SPOTIPY_REDIRECT_URI,scope=SCOPE,cache_handler="CacheDB")

# all above this to go in User class

def find_song_lyrics_last_chance(title, artist):
    try:
        return genius.search_song(title=title, artist=artist, song_id=None, get_full_info=True)
    except Exception as e:
        print("find_song_lyrics_last_chance error: genius second attempt failure")
        return None

def find_song_lyrics(title, artist):
    """searches genius for single title and returns lyrics as string"""
    try:
        song = genius.search_song(title=title, artist=artist, song_id=None, get_full_info=True)
    except Exception as e:
        print("find_song_lyrics error: genius first attempt failure")
        genius = lyricsgenius.Genius(remove_section_headers=True, retries=3)
        song = find_song_lyrics_last_chance(title, artist)

    if song is not None:
        lyrics = song.lyrics
        if lyrics[-5:] == 'Embed':
            lyrics = lyrics[:-5]
        return lyrics

def save_song_lyrics(track_id, lyrics):
    """saves entire text of song lyrics as string"""
    lyrics = Lyrics(
        track_id = track_id,
        lyrics = lyrics
    )
    db.session.add(lyrics)
    db.session.commit()

def find_playlist_lyrics(playlist_id):
    """searches genius for batch of songs, returns dictionary(? tbd)"""

# don't need since implementing count for filter
# def create_lyrics(lyrics):
#     """creates a set of unique words in lyrics and returns them as a string separated by line breaks"""
#     unique_lyrics = set()
#     for word in lyrics:
#         unique_lyrics.add(word)
#     return "\n".join(list(unique_lyrics))

def count_words(lyrics: list):
    word_counts = {}
    for word in lyrics:
        word_counts[word] = word_counts.get(word, 0) +1
    return word_counts

def get_track_info(track_id):
    return Tracks.query.filter(Tracks.track_id == track_id).one_or_none()

def insert_track_info(track_id, title, artist, album_art, explicit, bad_words_count, instrumentalness):
    """saves track id and data from Spotify"""
    # don't add if already exists
    track = get_track_info(track_id)
    if track:
        # but update instrumentalness if missing
        if track.instrumentalness is None and instrumentalness is not None:
            update_instrumentalness(track_id, instrumentalness)
        return track

    track = Tracks(
        track_id = track_id,
        title = title,
        artist = artist,
        album_art = album_art,
        explicit = explicit,
        bad_words_count = bad_words_count,
        instrumentalness = instrumentalness
    )
    db.session.add(track)
    db.session.commit()
    return track

def fetch_instrumentalness(track_id):
    """fetches instrumentalness from spotify audio features"""
    try:
        audio_features = spotify.audio_features(track_id)
        print("audio features for track", track_id,  audio_features)
        if audio_features != [None]:
            instrumentalness = audio_features[0]['instrumentalness']
            if instrumentalness:
                # print(instrumentalness)
                return instrumentalness
            else: 
                return 0
        else:
            return 0
    except Exception as e:
        print("fetch_instrumentalness error:", e)
        return 0


def update_instrumentalness(track_id, instrumentalness):
    """updates track info with instrumentalness"""
    track = get_track_info(track_id)
    if track is not None:
        track.instrumentalness = instrumentalness
        db.session.commit()


def update_bad_words_count(track_id, bad_words_count):
    """updates track record with count of default bad words"""
    track = get_track_info(track_id)
    if track is not None:
        # manipulating the objects does all the work
        # you just alter the object and it will translate to SQL
        # magicially on commit so:
        # UPDATE tracks SET bad_words_count = bad_words_count WHERE track.id = track_id
        track.bad_words_count = bad_words_count
        # it only gets run on the DB after commit
        # good ref: https://stackoverflow.com/a/18244144
        db.session.commit()

# Do I need to change/should I changethe way this works as well now that the index is there?

def has_lyrics(track_id):
    if CachedLyrics.query.filter(CachedLyrics.track_id == track_id).first():
        return True
    return False

# not called
# def get_word_count(track_id, word):
#     return CachedLyrics.query.filter(CachedLyrics.track_id == track_id).filter(CachedLyrics.word == word).one_or_none()

def save_lyrics(track_id: int, lyrics_words: list, word_counts: list, process_bad_words: bool):
    """ saves unique words in lyrics with a count of their occurences """
    if has_lyrics(track_id):
        return
    bad_words_count = 0
    cached_words = []
    for word in lyrics_words:
        if process_bad_words:
            if word in bad_words:
                bad_words_count += 1
        cached_words.append(dict(
            track_id = track_id,
            word = word,
            word_count = word_counts[word]
        ))
        # cached_lyric = CachedLyrics(
        #     track_id = track_id,
        #     word = word,
        #     word_count = word_counts[word],
        # )
        # db.session.add(cached_lyric)
    db.session.bulk_insert_mappings(CachedLyrics, cached_words)
    db.session.commit()
    if process_bad_words:
        update_bad_words_count(track_id, bad_words_count)

# returns the words for a track - if not already in system, loads lyrics, parses and adds them
def get_words_of_lyrics(track) -> None:
    word_list = None
    empty_word_list = ['nolyrics']
    # fetch word list if lyrics have already been processed
    if not has_lyrics(track.track_id):
        # word_list = get_words_by_track_id(track.track_id)
    # fetch lyrics if not already in db
    # else:
        # get lyrics from genius and write word counts to db
        lyrics = find_song_lyrics(track.title, track.artist)
        if lyrics is not None:
            save_song_lyrics(track.track_id, lyrics)
            lyrics_words = parse_lyrics(lyrics)
            word_counts = count_words(lyrics_words)
            save_lyrics(track.track_id, lyrics_words, word_counts, process_bad_words=True)
        else:
            # store a flag entry so has_lyrics returns true
            word_counts = {'nolyrics': 1}
            save_lyrics(track.track_id, empty_word_list, word_counts, process_bad_words=False)
        # word_list = list(word_counts.keys())
    #return word_list
    
def parse_lyrics(lyrics: str):
    """ replace line breaks and periods with spaces """
    lyrics = lyrics.replace('\n', ' ')
    lyrics = lyrics.replace('\r', ' ')
    lyrics = lyrics.replace('.', ' ')
    # int'l lowercase
    lyrics = lyrics.casefold()
    """ removes any other symbol that is not a letter, number or space """
    lyrics = re.sub(r'[^a-z\s]', '', lyrics)
    """ convert any string of spaces into a single space """
    lyrics = re.sub(r'\s+', " ", lyrics)
    """ split to words """
    return lyrics.split(" ")

# abovie to last comment to go in Lyrics class

# def build_filter(file):
#     """opens and parses file, removes phrases, returns single words as string separated by line breaks"""
#     file_string = open(file).read()
#     words = file_string.split(",")
#     single_words = []
#     for word in words:
#         check_word = word.strip()
#         if " " not in check_word:
#             single_words.append(check_word)
#     single_word_string = "\n".join(single_words)
#     return single_word_string

# def create_default_filter(word_list, filter_name):
#     """accepts list of words and creates filter"""
#     # " ".join(words)
#     filter = Filter(
#         word_list = word_list,
#         filter_name = filter_name
#     )

#     db.session.add(filter)
#     db.session.commit()

# def create_user_filter(user_id, filter_name):
#     """creates empty filter"""
#     filter = Filter(
#         user_id = user_id,
#         filter_name = filter_name
#     )

#     db.session.add(filter)
#     db.session.commit()

# def get_filter_words_by_id(filter_id):
#     """gets word list associated with each filter id"""
#     word_list = dd.session.query


# refactor to do counts
# TODO: future filters
def apply_filter(unique_words: list, filter_id: int):
    """checks for exact match of excluded terms, returns boolean"""
    # index is internal to how the DB stores data
    # it gets used automatically if you filter on the fields in the index
    check_words = Filter.query(Filter.word_list).filter(Filter.filter_id == filter_id).first()

    # fail_words = {}
    # for word in check_words:
    #     if word in unique_words:
    #         return False
    # return True


def save_status(track_id, filter_id):
    """saves pass/fail status of track for chosen filter"""


# def filter_cache_check(track_id, filter_id):
#     """checks if filter has previously been applied to track"""
#     entry = CachedResult.query.filter(CachedResult.track_id == track_id and CachedResult.filter_id == filter_id).first()
#     if entry:
#         return True
#     return False

# def get_cached_results(track_id, filter_id):
#     """returns cached pass/fail status of filter applied to track"""
#     return CachedResult.query(CachedResult.pass_status).filter(CachedResult.track_id == track_id and CachedResult.filter_id == filter_id)

# NOT CALLED
def get_words_by_track_id(track_id):
    """retrieves cached_lyrics from db"""
    response = db.session.query(CachedLyrics.word).filter(CachedLyrics.track_id == track_id).all()
    if response is not None:
        return [word for word, in response]

def search_for_playlists(search_term):
    """searches Spotify for playlists and returns top 10 playlist objects"""
    try:
        response = spotify.search(search_term, type="playlist")
        return response
    except Exception as e:
        print("search_for_playlists error:", e)
        return {}

def search_for_featured_playlists():
    """returns top playlists featured by spotify"""
    try:
        response = spotify.featured_playlists(limit=20)
        return response
    except Exception as e:
        print("search_for_featured_playlists error:", e)
        return {}

def search_for_user_playlists():
    """returns logged in user's saved playlists (50)"""
    try:
        response = spotify.current_user_playlists(limit=50)
        user_playlists = []
        for playlist in response['items']:
            data = {}
            if playlist['id']:
                data['id'] = playlist['id']
                data['description'] = playlist['description'] or ""
                data['name'] = playlist['name'] or ""
                data['art'] = playlist['images'][0]['url'] if playlist['images'] else ""
                user_playlists.append(data)
        # print("user playlists:", len(user_playlists))
        return response
    except Exception as e:
        print("search_for_user_playlists error:", e)
        return {}



def fetch_playlist_tracks_data(pid):
    """get song titles and id's from Spotify playlist"""
    try:
        response = spotify.playlist_items(pid)
            # fields='items.track.id,items.track.name,items.track.artists,items.track.album,total',
            # additional_types=['track'])
        # for track in response["items"]:
        #     print(track['track']['id'])
        # return True
        return response
    except Exception as e:
        print("fetch_playlist_tracks_data error:", e)
        return None
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
    





