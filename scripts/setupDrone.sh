#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Please specify the drone ID as an argument."
  exit 1
fi

DRONE_ID=$1
CONFIG_PATH="../config/default.json"
DRONE_PATH="/drone/$DRONE_ID"

echo "Initializing setup for drone $DRONE_ID..."

mkdir -p $DRONE_PATH

cp -r ../src/drones/* $DRONE_PATH/
cp $CONFIG_PATH $DRONE_PATH/

echo "Configuration and protocol files uploaded successfully to $DRONE_PATH."

echo "Drone $DRONE_ID setup complete."
