import raw_db
import lyricsgenius
import random
import time
import secret

# fill in a batch of Genius lyrics

raw_db = raw_db.raw_db()
raw_db.connect()

def run():
    batch_size = 100

    genius = lyricsgenius.Genius(access_token=secret.GENIUS_ACCESS_TOKEN, remove_section_headers=True, retries=3)
    genius.remove_section_headers = True
    genius.retries = 3

    # gets track ids for any track that has no lyrics
    query = "SELECT t1.track_id, t1.title, t1.artist FROM tracks t1 LEFT JOIN lyrics t2 ON t2.track_id = t1.track_id WHERE t2.track_id IS NULL LIMIT %s"
    rows = raw_db.sql('select', query, (batch_size,))
    for row in rows:
        # select results come back as a tuple, even if a single field, so access positionally
        track_id = row[0]
        title = row[1]
        artist = row[2]

        # sourced from crud
        if track_id is not None and (title is not None or artist is not None):
            try:
                song = genius.search_song(title=title, artist=artist, song_id=None, get_full_info=True)
            except Exception as e:
                print("find_song_lyrics error: genius first attempt failure:", e)
                genius = lyricsgenius.Genius(access_token=secret.GENIUS_ACCESS_TOKEN, remove_section_headers=True, retries=3)
                try:
                    song = genius.search_song(title=title, artist=artist, song_id=None, get_full_info=True)
                except Exception as e:
                    print("find_song_lyrics_last_chance error: genius second attempt failure")
                    song = None
        
        lyrics = song.lyrics if song is not None else None
        if lyrics is not None:
            if lyrics[-5:] == 'Embed':
                lyrics = lyrics[:-5]
            save_lyrics(track_id, lyrics)

        # wait a random length of time
        wait = random.randint(7, 15)
        time.sleep(wait)

    # clean up db connection
    raw_db.close()

def save_lyrics(track_id: str, lyrics: str):
    query = "INSERT INTO lyrics (track_id, lyrics) VALUES (%s, %s)"
    qargs = (track_id, lyrics)
    return raw_db.sql('insert', query, qargs)

run()