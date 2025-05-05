#!/bin/sh

# Create a runtime env-config.js with the current environment variables
echo "window.ENV_CONFIG = {" > ./dist/env-config.js
echo "  VITE_API_URL: \"$VITE_API_URL\"," >> ./dist/env-config.js
echo "};" >> ./dist/env-config.js

# Start the server
serve -s dist
