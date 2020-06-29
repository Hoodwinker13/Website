# def application(environ, start_response):
#     status = '200 OK'
#     output = b'Hello World!!'

#     response_headers = [('Content-type', 'text/plain'),
#                         ('Content-Length', str(len(output)))]
#     start_response(status, response_headers)

#     return [output]

import os
import sys

from flask import Flask
from flask_cors import CORS
from flask_script import Manager

sys.path.append('/var/www')
sys.path.append('/var/www/Website')
sys.path.append('/vaw/www/Website/main')

from config import config_by_name
from app import main_bp

def create_app(config_name):
    app = Flask(__name__)
    cfg = config_by_name[config_name]

    app.config.from_object(cfg)
    app.register_blueprint(main_bp)
    print(cfg)

    CORS(app, resources=cfg.CORS)
    return app

app = create_app(os.getenv("FLASK_ENV", "dev"))
manager = Manager(app)


@manager.command
def prod():
    app.run(debug=False, host="0.0.0.0", port=5000)

@manager.command
def dev():
    app.run(debug=True, host="127.0.0.1", port=5000)

if __name__ == "__main__":
    manager.run()
