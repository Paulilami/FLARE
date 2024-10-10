const DroneRegister = require('./DroneRegister');
const Logger = require('../utils/Logger');

class DecisionMaker {
  static makeDecision(droneID, context) {
    const drone = DroneRegister.getDrone(droneID);
    if (!drone) {
      Logger.error(`Drone ${droneID} not found.`);
      return;
    }

    switch (drone.getRole()) {
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
        Logger.log(`No decision logic defined for drone ${droneID} with role ${drone.getRole()}.`);
    }
  }

  static handleSearchDrone(drone, context) {
    if (context.targetFound) {
      Logger.log(`Drone ${drone.droneID} found the target. Sending signal to front drones.`);
      drone.sendSignal('target-found');
    } else {
      drone.scanArea({ distance: context.scanDistance || 100 });
    }
  }

  static handleFrontDrone(drone, context) {
    if (context.signal === 'target-found') {
      Logger.log(`Front drone ${drone.droneID} received target signal. Updating back drones.`);
      drone.relaySignal('target-found');
    } else {
      drone.hoverAndMonitor();
    }
  }

  static handleBackDrone(drone, context) {
    if (context.signal === 'target-found') {
      Logger.log(`Back drone ${drone.droneID} received target signal. Moving to support.`);
      drone.moveToLocation(context.targetLocation || { x: 0, y: 0 });
    } else {
      drone.followRoute(context.patrolRoute || [{ x: 0, y: 0 }]);
    }
  }
}

module.exports = DecisionMaker;
