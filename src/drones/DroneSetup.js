const fs = require('fs');
const path = require('path');
const Logger = require('../utils/Logger');
const ConfigManager = require('../utils/ConfigManager');
const DroneUtils = require('../utils/DroneUtils');

class DroneSetup {
  constructor(droneID) {
    this.droneID = droneID;
    this.active = false;
    this.role = 'unassigned';
    this.capabilities = {}; 
  }

  checkCapabilities() {
    Logger.log(`Checking capabilities for drone: ${this.droneID}`);
    const capabilities = DroneUtils.getDroneCapabilities(this.droneID);
    this.capabilities.hasCamera = capabilities.hasCamera || false;
    this.capabilities.hasSensors = capabilities.hasSensors || false;
    Logger.log(`Capabilities for ${this.droneID}: Camera=${this.capabilities.hasCamera}, Sensors=${this.capabilities.hasSensors}`);
  }

  activate() {
    this.active = true;
    Logger.log(`Drone ${this.droneID} activated.`);
    this.ping();
  }

  ping() {
    Logger.log(`Drone ${this.droneID} is pinging...`);
  }

  uploadProtocol() {
    Logger.log(`Uploading protocol to drone ${this.droneID}...`);
    const protocolFiles = path.join(__dirname, '../../config/protocols.json');
    try {
      fs.copyFileSync(protocolFiles, `/drone/${this.droneID}/protocols.json`);
      Logger.log(`Protocol successfully uploaded to drone ${this.droneID}`);
    } catch (err) {
      Logger.error(`Failed to upload protocol to drone ${this.droneID}: ${err.message}`);
    }
  }

  setRole(role) {
    this.role = role;
    Logger.log(`Drone ${this.droneID} assigned role: ${role}`);
  }

  getRole() {
    return this.role;
  }
}

module.exports = DroneSetup;
