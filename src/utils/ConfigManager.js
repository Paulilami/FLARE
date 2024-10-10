const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');

class ConfigManager {
  constructor() {
    this.configPath = path.join(__dirname, '../../config/default.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      Logger.log('Configuration loaded successfully.');
      return JSON.parse(configData);
    } catch (err) {
      Logger.error(`Failed to load configuration: ${err.message}`);
      return { drones: [] };
    }
  }

  getConfig() {
    return this.config;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8');
      Logger.log('Configuration saved successfully.');
    } catch (err) {
      Logger.error(`Failed to save configuration: ${err.message}`);
    }
  }

  resetConfig() {
    this.config = this.loadConfig();
    Logger.log('Configuration reset to defaults.');
  }
}

module.exports = new ConfigManager();
