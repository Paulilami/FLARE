const Logger = require('../utils/Logger');
const DroneSetup = require('./DroneSetup');
const ConfigManager = require('../utils/ConfigManager');

class DroneRegister {
  constructor() {
    this.drones = {};
  }

  addDrone(droneID) {
    const drone = new DroneSetup(droneID);
    this.drones[droneID] = drone;
    Logger.log(`Drone ${droneID} added to the register.`);

    const config = ConfigManager.getConfig();

    if (!config.drones) {
      config.drones = [];
    }

    if (!config.drones.includes(droneID)) {
      config.drones.push(droneID);
      ConfigManager.updateConfig({ drones: config.drones });
    }
  }

  removeDrone(droneID) {
    delete this.drones[droneID];
    Logger.log(`Drone ${droneID} removed from the register.`);

    const config = ConfigManager.getConfig();
    config.drones = config.drones.filter(id => id !== droneID);
    ConfigManager.updateConfig({ drones: config.drones });
  }

  getDrone(droneID) {
    return this.drones[droneID];
  }

  getAllDrones() {
    return Object.values(this.drones);
  }

  updateDroneStatus(droneID, status) {
    if (this.drones[droneID]) {
      this.drones[droneID].status = status;
      Logger.log(`Drone ${droneID} status updated to ${status}.`);
    }
  }
}

module.exports = new DroneRegister();
