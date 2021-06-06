import secrets
import os
import lyricsgenius
genius = lyricsgenius.Genius()

# Genius.search_song(title=None, artist='', song_id=None, get_full_info=True)

lyrics = genius.search_song(title='In Da Club', artist='', song_id=None, get_full_info=True)
print(lyrics.lyrics)
print(type(lyrics))
if 'shawty' in lyrics.lyrics:
    print('True')

# test from readme
# artist = genius.search_artist("Andy Shauf", max_songs=3, sort="title")
# print(artist.songs)


# geniusCreds = os.getenv('GENIUS_ACCESS_TOKEN')
# artist_name = 'Beyonce'

# api = genius.Genius(geniusCreds)
# artist = api.search_artist(artist_name, max_songs=5)

# print(artist)