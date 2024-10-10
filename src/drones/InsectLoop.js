const DroneRegister = require('./DroneRegister');
const Logger = require('../utils/Logger');

class InsectLoop {
  constructor(interval = 1000) {
    this.interval = interval;
    this.loop = null;
  }

  start() {
    if (!this.loop) {
      this.loop = setInterval(() => {
        this.checkDroneStatuses();
        this.updateDronePositions();
      }, this.interval);
      Logger.log('Insect loop started.');
    }
  }

  stop() {
    if (this.loop) {
      clearInterval(this.loop);
      this.loop = null;
      Logger.log('Insect loop stopped.');
    }
  }

  checkDroneStatuses() {
    const drones = DroneRegister.getAllDrones();
    drones.forEach(drone => {
      if (!drone.active) {
        Logger.log(`Drone ${drone.droneID} is inactive. Checking status...`);
        drone.ping();
      }
    });
  }

  updateDronePositions() {
    const drones = DroneRegister.getAllDrones();
    drones.forEach(drone => {
      if (drone.active) {
        const position = drone.getPosition();
        Logger.log(`Drone ${drone.droneID} position updated to ${JSON.stringify(position)}`);
      }
    });
  }
}

module.exports = new InsectLoop();
