#!/bin/bash

set -e

CONFIG_PATH="../config/default.json"
DEFAULT_CONFIG="../config/default.json.bak"

if [ -f "$DEFAULT_CONFIG" ]; then
  cp "$DEFAULT_CONFIG" "$CONFIG_PATH"
  echo "Configuration reset to defaults."
else
  echo "Backup configuration not found. Unable to reset."
  exit 1
fi

# Remove drone-specific data files if present
DRONE_DATA_PATH="../data/"
if [ -d "$DRONE_DATA_PATH" ]; then
  rm -rf "$DRONE_DATA_PATH"*
  echo "Drone data files have been removed."
fi

# Clear logs
LOGS_PATH="../logs/flare.log"
if [ -f "$LOGS_PATH" ]; then
  > "$LOGS_PATH"
  echo "Log files have been cleared."
fi

echo "System reset complete."
