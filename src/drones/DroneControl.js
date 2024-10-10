const DroneRegister = require('./DroneRegister');
const Logger = require('../utils/Logger');

class DroneControl {
  static startAll() {
    const drones = DroneRegister.getAllDrones();
    drones.forEach(drone => {
      drone.activate();
    });
    Logger.log('All drones have been started.');
  }

  static stopAll() {
    const drones = DroneRegister.getAllDrones();
    drones.forEach(drone => {
      drone.deactivate();
    });
    Logger.log('All drones have been stopped.');
  }

  static assignRoles() {
    const drones = DroneRegister.getAllDrones();
    const totalDrones = drones.length;
    if (totalDrones === 0) return;

    const searchCount = Math.floor(totalDrones * 0.2);
    const frontCount = Math.floor(totalDrones * 0.2);
    const backCount = totalDrones - searchCount - frontCount;
    let assigned = 0;

    drones.slice(0, searchCount).forEach(drone => {
      drone.setRole('search');
      Logger.log(`Drone ${drone.droneID} assigned role: search`);
      assigned++;
    });

    drones.slice(assigned, assigned + frontCount).forEach(drone => {
      drone.setRole('front');
      Logger.log(`Drone ${drone.droneID} assigned role: front`);
      assigned++;
    });

    drones.slice(assigned).forEach(drone => {
      drone.setRole('back');
      Logger.log(`Drone ${drone.droneID} assigned role: back`);
    });

    Logger.log('Roles have been assigned to all drones.');
  }

  static changeDroneRole(droneID, newRole) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.setRole(newRole);
      Logger.log(`Drone ${droneID} role changed to ${newRole}.`);
    } else {
      Logger.error(`Drone ${droneID} not found.`);
    }
  }

  static moveDrone(droneID, location) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.moveToLocation(location);
      Logger.log(`Drone ${droneID} moving to location: ${JSON.stringify(location)}`);
    } else {
      Logger.error(`Drone ${droneID} not found.`);
    }
  }

  static scanDroneArea(droneID, options) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.scanArea(options);
      Logger.log(`Drone ${droneID} scanning area with options: ${JSON.stringify(options)}`);
    } else {
      Logger.error(`Drone ${droneID} not found.`);
    }
  }

  static hoverAndMonitorDrone(droneID) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.hoverAndMonitor();
      Logger.log(`Drone ${droneID} hovering and monitoring.`);
    } else {
      Logger.error(`Drone ${droneID} not found.`);
    }
  }
}

module.exports = DroneControl;
