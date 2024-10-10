const DroneManager = require('../drones/DroneManager');
const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');
const ConfigManager = require('../utils/ConfigManager');

class FLARESystem {
  initialize(droneIDs) {
    droneIDs.forEach(id => {
      DroneManager.initializeDrone(id);
    });
    Logger.log('FLARE System initialized with drones: ' + droneIDs.join(', '));
  }

  addDrone(droneID) {
    DroneManager.initializeDrone(droneID);
    Logger.log(`Drone ${droneID} added to FLARE System.`);
  }

  start() {
    DroneRegister.getAllDrones().forEach(drone => drone.activate());
    Logger.log('All drones have been started.');
  }

  assignRoles() {
    DroneRegister.getAllDrones().forEach(drone => {
      const role = drone.getRole();
      Logger.log(`Drone ${drone.droneID} assigned role: ${role}`);
    });
    Logger.log('Roles assigned to drones.');
  }
}

module.exports = new FLARESystem();
