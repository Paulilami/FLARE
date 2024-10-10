const DroneRegister = require('./DroneRegister');
const Logger = require('../utils/Logger');

class InsectLoop {
  constructor(interval = 2000) {
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
        Logger.log(`Drone ${drone.droneID} is inactive. Attempting to reactivate...`);
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

  monitorForAnomalies() {
    const drones = DroneRegister.getAllDrones();
    drones.forEach(drone => {
      if (drone.active && Math.random() < 0.05) { // Random anomaly detection simulation
        Logger.warn(`Potential anomaly detected with drone ${drone.droneID}.`);
      }
    });
  }

  startAdvancedMonitoring() {
    if (!this.loop) {
      this.loop = setInterval(() => {
        this.checkDroneStatuses();
        this.updateDronePositions();
        this.monitorForAnomalies();
      }, this.interval);
      Logger.log('Advanced insect loop monitoring started.');
    }
  }
}

module.exports = new InsectLoop();
