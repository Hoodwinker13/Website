#!/usr/bin/python3
import os
import sys

sys.path.append('/var/www/html')
sys.path.append('/var/www/html/Website')
sys.path.append('/var/www/html/Website/main')
sys.path.append('/var/www/html/Website/static')
sys.path.append('/var/www/html/Website/templates')

from Website import create_app
application = create_app(os.getenv("FLASK_ENV", "dev"))
