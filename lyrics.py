import lyricsgenius
genius = lyricsgenius.Genius()

############
# TEST PAGE
# Genius.search_song(title=None, artist='', song_id=None, get_full_info=True)

song = genius.search_song(title='In Da Club', artist='', song_id=None, get_full_info=True)
# print(song.lyrics)
if 'shawty' in song.lyrics:
    print('True')

# test from readme
# artist = genius.search_artist("Andy Shauf", max_songs=3, sort="title")
# print(artist.songs)


# geniusCreds = os.getenv('GENIUS_ACCESS_TOKEN')
# artist_name = 'Beyonce'

# api = genius.Genius(geniusCreds)
# artist = api.search_artist(artist_name, max_songs=5)

# print(artist)