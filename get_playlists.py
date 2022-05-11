from flask import jsonify
import crud


def get_playlists(search_term: str) -> str:
    res = crud.search_for_playlists(search_term)
    playlist_data = []
    for i, item in enumerate(res['playlists']['items']):
        data = {}
        data['id'] = item['id']
        data['description'] = item['description']
        data['name'] = item['name']
        data['art'] = item['images'][0]['url']
        playlist_data.append(data)
    return jsonify(playlist_data)

def get_featured_playlists() -> str:
    res = crud.search_for_featured_playlists()
    featured_playlists = []
    for playlist in res['playlists']['items']:
        data = {}
        data['id'] = playlist['id']
        data['description'] = playlist['description']
        data['name'] = playlist['name']
        data['art'] = playlist['images'][0]['url']
        featured_playlists.append(data)
    return jsonify(featured_playlists)

def get_user_playlists() -> str:
    res = crud.search_for_user_playlists()
    user_playlists = []
    for playlist in res['items']:
        data = {}
        data['id'] = playlist['id']
        data['description'] = playlist['description']
        data['name'] = playlist['name']
        data['art'] = playlist['images'][0]['url']
        user_playlists.append(data)
    return jsonify(user_playlists)
    