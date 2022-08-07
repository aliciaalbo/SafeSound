from flask import jsonify
import crud

def jsonify_playlists(items):
    playlists = []
    for playlist in items:
        data = {}
        data['id'] = playlist['id']
        data['description'] = playlist['description']
        data['name'] = playlist['name']
        data['art'] = playlist['images'][0]['url'] if playlist['images'] else ""
        playlists.append(data)
    return jsonify(playlists)


def get_playlists(search_term: str) -> str:
    res = crud.search_for_playlists(search_term)
    if res == {}:
        return jsonify([])
    # print("get_playlists items: ", res['playlists']['items'])
    return jsonify_playlists(res['playlists']['items'])

def get_featured_playlists() -> str:
    res = crud.search_for_featured_playlists()
    if res == {}:
        return jsonify([])
    # print(res)
    return jsonify_playlists(res['playlists']['items'])

def get_user_playlists() -> str:
    res = crud.search_for_user_playlists()
    if res == {}:
        return jsonify([])
    return jsonify_playlists(res['items'])
