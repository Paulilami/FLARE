const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');
const ConfigManager = require('../utils/ConfigManager');

class RoleManager {
  static assignRoles() {
    const drones = DroneRegister.getAllDrones();
    const totalDrones = drones.length;

    if (totalDrones === 0) {
      Logger.warn('No drones available for role assignment.');
      return;
    }

    const config = ConfigManager.getConfig().roles;
    const searchCount = Math.floor((config.search / 100) * totalDrones);
    const frontCount = Math.floor((config.front / 100) * totalDrones);
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

    Logger.log(`Roles assigned: Search (${searchCount}), Front (${frontCount}), Back (${backCount}).`);
  }

  static changeRole(droneID, newRole) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      drone.setRole(newRole);
      Logger.log(`Drone ${droneID} role changed to ${newRole}.`);
    } else {
      Logger.error(`Drone ${droneID} not found for role change.`);
    }
  }

  static getRoleDistribution() {
    const roleDistribution = { search: 0, front: 0, back: 0 };
    DroneRegister.getAllDrones().forEach(drone => {
      if (roleDistribution[drone.getRole()] !== undefined) {
        roleDistribution[drone.getRole()]++;
      }
    });
    return roleDistribution;
  }
}

module.exports = RoleManager;
