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

  captureImageWithZoom(zoomFactor) {
    if (this.cameraActive) {
      const image = DroneUtils.captureImageWithZoom(this.droneID, zoomFactor);
      Logger.log(`Zoomed image captured by drone ${this.droneID} with zoom factor ${zoomFactor}.`);
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
    } else {
      Logger.error(`No image provided for processing on drone ${this.droneID}.`);
      return null;
    }
  }

  detectObjectDimensions(image) {
    const objects = DroneUtils.detectObjects(image);
    if (objects.length > 0) {
      const dimensions = objects.map(obj => {
        return {
          type: obj.type,
          width: this.calculateWidth(obj),
          height: this.calculateHeight(obj),
          position: obj.position
        };
      });
      Logger.log(`Detected objects with dimensions: ${JSON.stringify(dimensions)}.`);
      return dimensions;
    } else {
      Logger.error(`No objects detected in image for drone ${this.droneID}.`);
      return [];
    }
  }

  calculateWidth(object) {
    const width = Math.abs(object.position.x - object.position.x + 10); // Placeholder for actual calculation
    return width;
  }

  calculateHeight(object) {
    const height = Math.abs(object.position.y - object.position.y + 10); // Placeholder for actual calculation
    return height;
  }

  detectAndAnalyzeObjects(image) {
    const objects = this.processImage(image);
    if (objects) {
      const analyzedData = objects.details.map(obj => ({
        ...obj,
        dimensions: {
          height: this.calculateHeight(obj),
          width: this.calculateWidth(obj)
        }
      }));
      Logger.log(`Objects analyzed with dimensions: ${JSON.stringify(analyzedData)}.`);
      return analyzedData;
    }
    return [];
  }

  startContinuousCapture(interval = 1000) {
    if (!this.cameraActive) return;

    Logger.log(`Starting continuous image capture for drone ${this.droneID} with interval ${interval}ms.`);
    setInterval(() => {
      const image = this.captureImage();
      if (image) {
        this.processImage(image);
      }
    }, interval);
  }
}

module.exports = CameraHandler;
