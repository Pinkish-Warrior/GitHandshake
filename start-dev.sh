#!/bin/bash

# A script to start the complete development environment for GitHandshake.

# Clean up previous logs
rm -f server.log client.log

echo "--- Starting Podman machine... ---"
podman machine start

echo "\n--- Starting database container... ---"
podman compose up -d

echo "\n--- Waiting for database to initialize (5 seconds)... ---"
sleep 5

echo "\n--- Starting backend server (output will be in server.log) ---"
npm run server > server.log 2>&1 &
SERVER_PID=$!
echo "Backend server process started with PID: $SERVER_PID"

echo "\n--- Starting frontend client (output will be in client.log) ---"
npm run client > client.log 2>&1 &
CLIENT_PID=$!
echo "Frontend client process started with PID: $CLIENT_PID"


echo "\n--- Waiting for servers to be ready (will timeout in 60s)... ---"

# Function to check for success message in log file
# Usage: wait_for_log "log_file" "success_message" "server_name"
wait_for_log() {
    local log_file="$1"
    local success_message="$2"
    local server_name="$3"
    local timeout=60  # Timeout in seconds
    local elapsed=0

    while ! grep -q "$success_message" "$log_file"; do
        if [ $elapsed -ge $timeout ]; then
            echo "Error: $server_name did not start within $timeout seconds."
            echo "--- $server_name logs ---"
            cat "$log_file"
            echo "--------------------"
            # Stop the other process if one fails
            kill $SERVER_PID $CLIENT_PID 2>/dev/null
            exit 1
        fi
        sleep 2
        elapsed=$((elapsed + 2))
        echo -n "."
    done
    echo -e "\n\xE2\x9C\x94 $server_name is ready!"
}

wait_for_log "server.log" "Server listening on port" "Backend Server"
wait_for_log "client.log" "Ready" "Frontend Client"


echo "\n\n--- \xE2\x9C\x85 Development environment is running! ---"
echo "  - Frontend available at: http://localhost:3000"
echo "  - Backend API listening on port 3001"
echo ""
echo "To view logs in real-time, run:"
echo "  tail -f server.log"
echo "  tail -f client.log"
echo ""
echo "To stop the environment, run ./stop-dev.sh"
