import raw_db
import lyricsgenius
import random
import time
import secret
import crud
import get_playlists


def run():
    res = crud.search_for_featured_playlists()
    if res == {}:
        return []
    data = res['playlists']['items']
    playlist_ids = []
    for playlist in data:
        playlist_ids.append(playlist['id'])
    print(playlist_ids)

run()