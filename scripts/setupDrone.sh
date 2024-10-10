#!/bin/bash

DRONE_IP=$1
DRONE_PORT=$2
DRONE_ID=$3

if [ -z "$DRONE_IP" ] || [ -z "$DRONE_PORT" ] || [ -z "$DRONE_ID" ]; then
  echo "Usage: ./setupDrone.sh <DRONE_IP> <DRONE_PORT> <DRONE_ID>"
  exit 1
fi

echo "Initializing drone setup..."
echo "Configuring drone with ID: $DRONE_ID at $DRONE_IP:$DRONE_PORT"

# Send initial setup commands to the drone
echo "Sending setup command to drone..."
echo "setup:$DRONE_ID" | nc -u $DRONE_IP $DRONE_PORT

echo "Drone setup completed successfully."
