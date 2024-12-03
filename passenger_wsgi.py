import imp
import os
import sys


sys.path.insert(0, os.path.dirname(__file__))

wsgi = imp.load_source('wsgi', 'main.py')
application = wsgi.app



# from main import app as application

# if __name__ == "__main__":
#     application.run()