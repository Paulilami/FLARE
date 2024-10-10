const DroneSetup = require('./DroneSetup');
const DroneRegister = require('./DroneRegister');
const Logger = require('../utils/Logger');

class DroneManager {
  static initializeDrone(droneID) {
    const drone = new DroneSetup(droneID);
    drone.checkCapabilities();
    DroneRegister.addDrone(drone);
    Logger.log(`Drone ${droneID} initialized and added to register.`);
  }

  static activateDrone(droneID) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.activate();
      Logger.log(`Drone ${droneID} activated.`);
    } else {
      Logger.error(`Drone ${droneID} not found in the register.`);
    }
  }

  static uploadProtocolToDrone(droneID) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.uploadProtocol();
    } else {
      Logger.error(`Drone ${droneID} not found in the register.`);
    }
  }

  static removeDrone(droneID) {
    DroneRegister.removeDrone(droneID);
    Logger.log(`Drone ${droneID} removed from the system.`);
  }
}

module.exports = DroneManager;
