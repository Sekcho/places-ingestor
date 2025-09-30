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
    # Railway automatically sets PORT, so use that if available
    port = int(os.getenv('PORT', 8000))
    host = '0.0.0.0'  # Always bind to all interfaces for Railway
    debug = os.getenv('DEBUG', 'False').lower() == 'true'  # Default to production mode

    # Print environment info for debugging
    print(f"Environment PORT: {os.getenv('PORT', 'not set')}")
    print(f"Environment HOST: {os.getenv('HOST', 'not set')}")
    print(f"Environment DEBUG: {os.getenv('DEBUG', 'not set')}")

    # Validate required environment variables (allow startup without API key for health checks)
    api_key = os.getenv('GOOGLE_PLACES_API_KEY')
    if not api_key:
        print("Warning: GOOGLE_PLACES_API_KEY environment variable not set")
        print("Please set it in Railway environment variables for full functionality")
        print("Starting server anyway for health checks...")

    print("Starting Places Ingestor Backend...")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Debug: {debug}")
    print(f"API Key: {'Set' if api_key else 'Missing'}")

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
        })
        # Only add these if they're available
        try:
            import uvloop
            config['loop'] = 'uvloop'
        except ImportError:
            pass
        try:
            import httptools
            config['http'] = 'httptools'
        except ImportError:
            pass

    print("Configuration:", config)

    try:
        print("Starting uvicorn server...")
        uvicorn.run(**config)
    except KeyboardInterrupt:
        print("\nServer shutdown requested by user")
    except Exception as e:
        print(f"Failed to start server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()