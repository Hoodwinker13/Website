#!/usr/bin/python3
import os
import sys

sys.path.append('/var/www')
sys.path.append('/var/www/Website')
sys.path.append('/var/www/Website/main')

from Website import create_app
application = create_app(os.getenv("FLASK_ENV", "dev"))
