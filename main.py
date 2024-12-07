from flask import Flask, jsonify, abort, render_template, url_for
import os
import json
from datetime import datetime

app = Flask(__name__, static_folder='eder')  # Ustawienie `eder` jako folderu statycznego

def list_files(directory):
    file_tree = []
    for root, dirs, files in os.walk(directory):
        path = root.replace(directory, '')  # Relatywna ścieżka względem `eder`
        for name in files:
            file_tree.append(os.path.join(path, name).lstrip('/'))
    return file_tree

@app.route('/')
def index():
    files = list_files(os.path.join(app.static_folder, "songs"))  # Przeglądaj pliki w folderze `eder`
    return render_template('index.html', files=files)

def get_song_details(song_dir):
    """
    Reads details of a song from its directory.
    Assumes the directory contains an MP3 file and a description.json file.
    """
    try:
        # List files in the directory
        files = os.listdir(song_dir)
        mp3_file = next((f for f in files if f.endswith('.mp3')), None)
        json_file = next((f for f in files if f.endswith('.json')), None)

        if not mp3_file:
            return None  # Both files must be present

        if json_file is not None:
        # Read JSON description
            with open(os.path.join(song_dir, json_file), 'r', encoding="utf-8") as f:
                description = json.load(f)

            # Ensure title and release date exist in JSON
            title = description.get("title", "Unknown Title")
            release_date = description.get("releaseDate", "Unknown Date")

        # Build the track details
        else:
            title = "Unknown Title"
            release_date = "Unknown Date"

        relative_path = os.path.relpath(song_dir, app.static_folder)

        return {
            "title": title,
            "exportDate": release_date,
            "credits": description.get("credits", "No credits available"),
            "audioSrc": url_for('static', filename=os.path.join(relative_path, mp3_file))
        }
    except Exception as e:
        print(f"Error processing {song_dir}: {e}")
        return None

@app.route('/tracks', methods=['GET'])
def tracks():
    """
    Endpoint that returns details of a song.
    """
    # Look for directories in `eder`
    base_dir = os.path.join(app.static_folder, "songs")
    directories = [os.path.join(base_dir, d) for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]

    # Process each directory to find song details
    tracks = []
    for song_dir in directories:
        try:
            song_details = get_song_details(song_dir)
            if song_details:
                tracks.append(song_details)
        except Exception as e:
            print(f"Error processing {song_dir}: {e}")

    # Return 404 if no valid songs are found
    if not tracks:
        abort(404, description="No songs found")

    return jsonify(tracks)


@app.route('/sklep')
def sklep():
    return render_template('sklep.html')

if __name__ == "__main__":
    app.run()