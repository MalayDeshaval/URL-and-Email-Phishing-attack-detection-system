import sys
import os

# Add the backend/app directory to the path so main.py can be imported 
# and its relative imports (like 'import models') work correctly.
backend_app_dir = os.path.join(os.path.dirname(__file__), "..", "backend", "app")
sys.path.append(backend_app_dir)

# Now we can import the app
from main import app as handler

# This makes the app available for Vercel
app = handler
