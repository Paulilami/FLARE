const DroneRegister = require('./DroneRegister');
const Logger = require('../utils/Logger');

class DecisionMaker {
  static makeDecision(droneID, context) {
    const drone = DroneRegister.getDrone(droneID);
    if (!drone) {
      Logger.error(`Drone ${droneID} not found.`);
      return;
    }

    switch (drone.role) {
      case 'search':
        this.handleSearchDrone(drone, context);
        break;
      case 'front':
        this.handleFrontDrone(drone, context);
        break;
      case 'back':
        this.handleBackDrone(drone, context);
        break;
      default:
        Logger.log(`No decision logic defined for drone ${droneID} with role ${drone.role}.`);
    }
  }

  static handleSearchDrone(drone, context) {
    if (context.targetFound) {
      Logger.log(`Drone ${drone.droneID} found the target. Sending signal to front drones.`);
      drone.sendSignal('target-found');
    } else {
      drone.scanArea();
    }
  }

  static handleFrontDrone(drone, context) {
    if (context.signal === 'target-found') {
      Logger.log(`Front drone ${drone.droneID} received target signal. Updating back drones.`);
      drone.relaySignal('target-found');
    }
  }

  static handleBackDrone(drone, context) {
    if (context.signal === 'target-found') {
      Logger.log(`Back drone ${drone.droneID} received target signal. Moving to support.`);
      drone.moveToSupport();
    }
  }
}

module.exports = DecisionMaker;
