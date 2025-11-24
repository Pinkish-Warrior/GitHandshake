#!/bin/bash

# A script to stop the development environment for GitHandshake.

echo "--- Stopping backend and frontend servers... ---"
# Use pkill to find and kill the processes by name, which is robust.
pkill -f "next dev"
pkill -f "nest start --watch"
echo "Servers stopped."

echo "\n--- Stopping database container... ---"
podman compose down

# Clean up log files
rm -f server.log client.log

echo "\n--- Development environment stopped. ---"
echo "If you are done with development, you can also stop the Podman machine with: podman machine stop"
