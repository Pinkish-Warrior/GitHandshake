#!/bin/bash

# A script to stop the development environment for GitHandshake.

echo "--- Stopping backend and frontend servers... ---"
pkill -f "pnpm --filter server" 2>/dev/null
pkill -f "pnpm --filter client" 2>/dev/null
pkill -f "next dev" 2>/dev/null
pkill -f "nest start" 2>/dev/null
echo "Servers stopped."

echo ""
echo "--- Stopping database container... ---"
podman-compose down 2>&1 | grep -v "no container\|no such container"

# Clean up log files
rm -f server.log client.log

echo ""
echo "--- Development environment stopped. ---"
echo "If you are done with development, you can also stop the Podman machine with: podman machine stop"
