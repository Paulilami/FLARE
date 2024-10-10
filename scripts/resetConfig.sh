CONFIG_FILE="./config/default.json"

echo "Resetting configuration to default values..."

cp ./config/default.json.backup $CONFIG_FILE

echo "Configuration reset successfully."
