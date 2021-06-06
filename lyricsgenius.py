import secrets
import os
import lyricsgenius
genius = lyricsgenius.Genius()

artist = genius.search_artist("Andy Shauf", max_songs=3, sort="title")
print(artist.songs)


# geniusCreds = os.getenv('GENIUS_ACCESS_TOKEN')
# artist_name = 'Beyonce'

# api = genius.Genius(geniusCreds)
# artist = api.search_artist(artist_name, max_songs=5)

# print(artist)