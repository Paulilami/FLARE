const DroneSetup = require('./DroneSetup');
const DroneRegister = require('./DroneRegister');
const Logger = require('../utils/Logger');

class DroneManager {
  static initializeDrone(droneID) {
    if (DroneRegister.getDrone(droneID)) {
      Logger.warn(`Drone ${droneID} is already registered.`);
      return;
    }

    const drone = new DroneSetup(droneID);
    drone.checkCapabilities();
    DroneRegister.addDrone(drone);
    Logger.log(`Drone ${droneID} initialized and added to the register.`);
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

  static deactivateDrone(droneID) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.deactivate();
      Logger.log(`Drone ${droneID} deactivated.`);
    } else {
      Logger.error(`Drone ${droneID} not found in the register.`);
    }
  }

  static uploadProtocolToDrone(droneID, protocolFile) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.uploadProtocol(protocolFile);
      Logger.log(`Protocol uploaded to drone ${droneID}.`);
    } else {
      Logger.error(`Drone ${droneID} not found in the register.`);
    }
  }

  static moveDroneToLocation(droneID, location) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.moveToLocation(location);
      Logger.log(`Drone ${droneID} moving to location: ${JSON.stringify(location)}`);
    } else {
      Logger.error(`Drone ${droneID} not found.`);
    }
  }

  static setDroneRole(droneID, role) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.setRole(role);
      Logger.log(`Drone ${droneID} assigned role: ${role}.`);
    } else {
      Logger.error(`Drone ${droneID} not found in the register.`);
    }
  }

  static removeDrone(droneID) {
    if (DroneRegister.getDrone(droneID)) {
      DroneRegister.removeDrone(droneID);
      Logger.log(`Drone ${droneID} removed from the system.`);
    } else {
      Logger.warn(`Attempted to remove non-existing drone ${droneID}.`);
    }
  }

  static getDroneStatus(droneID) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      const status = drone.getStatus();
      Logger.log(`Drone ${droneID} status: ${JSON.stringify(status)}`);
      return status;
    } else {
      Logger.error(`Drone ${droneID} not found.`);
      return null;
    }
  }
}

module.exports = DroneManager;
