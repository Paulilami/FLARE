const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class SensorManager {
  constructor(droneID) {
    this.droneID = droneID;
    this.sensorsActive = false;
  }

  initialize() {
    if (DroneUtils.hasSensors(this.droneID)) {
      this.sensorsActive = true;
      Logger.log(`Sensors initialized for drone ${this.droneID}.`);
    } else {
      Logger.error(`Drone ${this.droneID} does not have sensors.`);
    }
  }

  readData() {
    if (this.sensorsActive) {
      const data = DroneUtils.readSensorData(this.droneID);
      Logger.log(`Sensor data read from drone ${this.droneID}.`);
      return data;
    } else {
      Logger.error(`Sensors not active on drone ${this.droneID}.`);
      return null;
    }
  }

  processSensorData(data) {
    if (data) {
      const processedData = DroneUtils.processSensorData(data);
      Logger.log(`Sensor data processed for drone ${this.droneID}.`);
      return processedData;
    }
    Logger.error(`No sensor data provided for processing on drone ${this.droneID}.`);
    return null;
  }
}

module.exports = SensorManager;
