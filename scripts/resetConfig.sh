#!/bin/bash

CONFIG_PATH="../config/default.json"
DEFAULT_CONFIG="../config/default.json.bak"

if [ -f "$DEFAULT_CONFIG" ]; then
  cp "$DEFAULT_CONFIG" "$CONFIG_PATH"
  echo "Configuration reset to defaults."
else
  echo "Backup configuration not found. Unable to reset."
  exit 1
fi
