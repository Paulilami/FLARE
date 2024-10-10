const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');

class RoleManager {
  static assignRoles() {
    const drones = DroneRegister.getAllDrones();
    const totalDrones = drones.length;
    const searchCount = Math.floor(totalDrones * 0.2);
    const frontCount = Math.floor(totalDrones * 0.2);
    const backCount = totalDrones - searchCount - frontCount;
    let assigned = 0;

    drones.slice(0, searchCount).forEach(drone => {
      drone.setRole('search');
      assigned++;
    });

    drones.slice(assigned, assigned + frontCount).forEach(drone => {
      drone.setRole('front');
      assigned++;
    });

    drones.slice(assigned).forEach(drone => {
      drone.setRole('back');
    });

    Logger.log('Roles have been assigned: Search, Front, and Back.');
  }

  static changeRole(droneID, newRole) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.setRole(newRole);
      Logger.log(`Drone ${droneID} role changed to ${newRole}.`);
    } else {
      Logger.error(`Drone ${droneID} not found.`);
    }
  }
}

module.exports = RoleManager;
