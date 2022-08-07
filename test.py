import raw_db
import lyricsgenius
import random
import time
import secret

# fill in a batch of Genius lyrics

raw_db = raw_db.raw_db()
raw_db.connect()

try:
    genius = lyricsgenius.Genius(access_token=secret.GENIUS_ACCESS_TOKEN, remove_section_headers=True, retries=3)
    genius.remove_section_headers = True
    genius.retries = 3
except Exception as e:
    query = "INSERT INTO lyrics (track_id, lyrics) VALUES (%s, %s)"
    qargs = ('bad', 'bad')
    raw_db.sql('insert', query, qargs)

query = "INSERT INTO lyrics (track_id, lyrics) VALUES (%s, %s)"
qargs = ('foo', 'foo')
raw_db.sql('insert', query, qargs)

raw_db.close()