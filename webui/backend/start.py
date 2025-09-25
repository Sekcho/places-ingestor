#!/usr/bin/env python3
"""
Production-ready server startup script for Places Ingestor Backend
"""
import os
import sys
import uvicorn
from pathlib import Path
from dotenv import load_dotenv

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Load environment variables
load_dotenv()

def main():
    # Get configuration from environment variables
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('DEBUG', 'True').lower() == 'true'

    # Validate required environment variables
    api_key = os.getenv('GOOGLE_PLACES_API_KEY')
    if not api_key:
        print("❌ Error: GOOGLE_PLACES_API_KEY environment variable is required")
        print("💡 Please set it in your .env file or environment variables")
        sys.exit(1)

    print("🚀 Starting Places Ingestor Backend...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🔧 Debug: {debug}")
    print(f"🗝️  API Key: {'✅ Set' if api_key else '❌ Missing'}")

    # Configure uvicorn
    config = {
        'app': 'main:app',
        'host': host,
        'port': port,
        'reload': debug,
        'log_level': 'info' if not debug else 'debug',
        'access_log': True
    }

    # Add production optimizations if not in debug mode
    if not debug:
        config.update({
            'workers': 1,  # For Railway's single container
            'loop': 'uvloop',
            'http': 'httptools'
        })

    try:
        uvicorn.run(**config)
    except KeyboardInterrupt:
        print("\n🛑 Server shutdown requested by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()