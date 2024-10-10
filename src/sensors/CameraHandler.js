const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class CameraHandler {
  constructor(droneID) {
    this.droneID = droneID;
    this.cameraActive = false;
  }

  initialize() {
    if (DroneUtils.hasCamera(this.droneID)) {
      this.cameraActive = true;
      Logger.log(`Camera initialized for drone ${this.droneID}.`);
    } else {
      Logger.error(`Drone ${this.droneID} does not have a camera.`);
    }
  }

  captureImage() {
    if (this.cameraActive) {
      const image = DroneUtils.captureImage(this.droneID);
      Logger.log(`Image captured by drone ${this.droneID}.`);
      return image;
    } else {
      Logger.error(`Camera not active on drone ${this.droneID}.`);
      return null;
    }
  }

  processImage(image) {
    if (image) {
      const processedData = DroneUtils.processImage(image);
      Logger.log(`Image processed for drone ${this.droneID}.`);
      return processedData;
    }
    Logger.error(`No image provided for processing on drone ${this.droneID}.`);
    return null;
  }
}

module.exports = CameraHandler;
