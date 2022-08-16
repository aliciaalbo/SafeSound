from model import connect_to_db
from flask import (Flask, render_template, request, session, redirect, jsonify)
from flask_session import Session
import crud
import get_playlists


def get_playlists():
    ()

def get_track_data(pid):
    track_data = []
        # session['processing_tracks'] = track_data
    pid = request.args.get('pid')
    if pid is None or pid == "":
        return jsonify([])
    print("getTracks pid: ", pid)
    res = crud.fetch_playlist_tracks_data(pid)
    # bail if Spotify loading error
    if res is None:
        return jsonify([])
    if "items" in res:
        track_res = res['items']
    else:
        track_res = res
    # print("getTracks valid res: ", res['items'])
    data = {}

    for track in track_res:
        if data == {}:
            print(track)
        data = {}

        try:
            data['id'] = track['track']['id']
            data['title'] = track['track']['name']
            data['art'] = track['track']['album']['images'][0]['url'] if track['track']['album']['images'] else ""
            artist_name = ''
            for artist in track['track']['artists']:
                if artist_name == '':
                    artist_name = artist['name']   
                else:
                    artist_name = artist_name + ', ' + artist['name']
            data['artist'] = artist_name
            data['explicit'] = track['track']['explicit']
            data['bad_words_count'] = -1
            # insert the track info if not already there
            if data['id']:
                track = crud.insert_track_info(
                    track_id = data['id'],
                    title = data['title'] or '',
                    artist = data['artist'] or '',
                    album_art = data['art'] or '',
                    explicit = bool(data['explicit']),
                    instrumentalness = None,
                    bad_words_count = -1,
                )
                if track:
                    # fetch and store the lyrics if not in db
                    crud.get_words_of_lyrics(track)
            track_data.append(data)
            session['processing_tracks'] = track_data
        except Exception as e:
            print(e)
            continue
        # except(TypeError):
        #     print("type error", TypeError)
        #     continue
    # print(track_data)
    # session.pop('processing_tracks')
    return jsonify(track_data)