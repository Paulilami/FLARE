#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Please specify the drone ID as an argument."
  exit 1
fi

DRONE_ID=$1
DRONE_PORT=$2
CONFIG_PATH="../config/default.json"
DRONE_PATH="/drone/$DRONE_ID"

echo "Initializing setup for drone $DRONE_ID on port $DRONE_PORT..."

# Create directory structure for the drone
mkdir -p $DRONE_PATH

# Copy configuration and protocol files to the drone path
cp -r ../src/drones/* $DRONE_PATH/
cp $CONFIG_PATH $DRONE_PATH/

# Add drone configuration to the central config file
echo "Updating central configuration with drone $DRONE_ID..."
node -e "
const fs = require('fs');
const configPath = '$CONFIG_PATH';
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
config.drones.push({ droneID: '$DRONE_ID', port: $DRONE_PORT, active: false, role: 'unassigned', capabilities: { hasCamera: false, hasSensors: false } });
fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
"

echo "Drone $DRONE_ID setup complete and added to the configuration."
