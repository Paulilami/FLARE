const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');

class ConfigManager {
  constructor() {
    this.configPath = path.join(__dirname, '../../config/default.json');
    this.loadConfig();
  }

  loadConfig() {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      this.config = JSON.parse(configData);
      Logger.log('Configuration loaded successfully.');
    } catch (err) {
      Logger.error(`Failed to load configuration: ${err.message}`);
      this.config = { drones: [], roles: {}, protocols: {} };
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
    this.loadConfig();
    Logger.log('Configuration reset to defaults.');
  }

  getDroneConfig(droneID) {
    return this.config.drones.find(drone => drone.droneID === droneID) || null;
  }

  updateDroneConfig(droneID, newDroneConfig) {
    const droneIndex = this.config.drones.findIndex(drone => drone.droneID === droneID);
    if (droneIndex !== -1) {
      this.config.drones[droneIndex] = { ...this.config.drones[droneIndex], ...newDroneConfig };
      this.saveConfig();
      Logger.log(`Drone configuration updated for ${droneID}.`);
    } else {
      Logger.error(`Drone ${droneID} not found in configuration.`);
    }
  }

  removeDroneConfig(droneID) {
    this.config.drones = this.config.drones.filter(drone => drone.droneID !== droneID);
    this.saveConfig();
    Logger.log(`Drone ${droneID} removed from configuration.`);
  }
}

module.exports = new ConfigManager();
