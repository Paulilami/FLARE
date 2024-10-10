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

  static assignRoles() {
    const drones = DroneRegister.getAllDrones();
    const totalDrones = drones.length;
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
}

module.exports = DroneControl;
