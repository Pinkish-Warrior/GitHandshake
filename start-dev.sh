#!/bin/bash

# A script to start the complete development environment for GitHandshake.

# Clean up previous logs
rm -f server.log client.log

echo "--- Starting Podman machine... ---"
podman machine start 2>/dev/null || echo "Podman machine already running."

echo ""
echo "--- Starting database container... ---"
podman-compose up -d db

echo ""
echo "--- Waiting for database to be ready (5 seconds)... ---"
sleep 5

echo ""
echo "--- Starting backend server (output will be in server.log) ---"
pnpm run server > server.log 2>&1 &
SERVER_PID=$!
echo "Backend server process started with PID: $SERVER_PID"

echo ""
echo "--- Starting frontend client (output will be in client.log) ---"
pnpm run client > client.log 2>&1 &
CLIENT_PID=$!
echo "Frontend client process started with PID: $CLIENT_PID"

echo ""
echo "--- Waiting for servers to be ready (will timeout in 60s)... ---"

# Function to check for success message in log file
# Usage: wait_for_log "log_file" "success_message" "server_name"
wait_for_log() {
    local log_file="$1"
    local success_message="$2"
    local server_name="$3"
    local timeout=60
    local elapsed=0

    while ! grep -q "$success_message" "$log_file" 2>/dev/null; do
        if [ $elapsed -ge $timeout ]; then
            echo ""
            echo "Error: $server_name did not start within $timeout seconds."
            echo "--- $server_name logs ---"
            cat "$log_file"
            echo "--------------------"
            kill $SERVER_PID $CLIENT_PID 2>/dev/null
            exit 1
        fi
        sleep 2
        elapsed=$((elapsed + 2))
        echo -n "."
    done
    echo ""
    echo "$server_name is ready!"
}

wait_for_log "server.log" "Server listening on port" "Backend Server"
wait_for_log "client.log" "Ready" "Frontend Client"

echo ""
echo "--- Development environment is running! ---"
echo "  - Frontend available at: http://localhost:3000"
echo "  - Backend API listening on port 3001"
echo ""
echo "To view logs in real-time, run:"
echo "  tail -f server.log"
echo "  tail -f client.log"
echo ""
echo "To stop the environment, run ./stop-dev.sh"
