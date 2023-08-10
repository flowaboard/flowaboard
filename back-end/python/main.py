from flask import Flask, send_from_directory
import os

app = Flask(__name__)

FRONTEND_DIR = os.path.join(os.getcwd(), 'front-end')

@app.route('/<path:path>')
def serve_files(path):
    print(FRONTEND_DIR, path)
    return send_from_directory(FRONTEND_DIR, path)

if __name__ == "__main__":
    app.run(port=8000)