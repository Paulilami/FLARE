const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class ObjectDetection {
  constructor(droneID) {
    this.droneID = droneID;
    this.cameraActive = false;
    this.modelLoaded = false;
  }

  initialize() {
    if (DroneUtils.hasCamera(this.droneID)) {
      this.cameraActive = true;
      this.loadModel();
      Logger.log(`Object Detection initialized for drone ${this.droneID}.`);
    } else {
      Logger.error(`Drone ${this.droneID} does not have a camera.`);
    }
  }

  loadModel() {
    this.modelLoaded = DroneUtils.loadObjectDetectionModel();
    if (this.modelLoaded) {
      Logger.log(`Object detection model loaded successfully on drone ${this.droneID}.`);
    } else {
      Logger.error(`Failed to load object detection model on drone ${this.droneID}.`);
    }
  }

  captureAndProcessImage() {
    if (!this.cameraActive || !this.modelLoaded) return [];

    const image = DroneUtils.captureImage(this.droneID);
    if (!image) {
      Logger.error(`Failed to capture image for object detection on drone ${this.droneID}.`);
      return [];
    }

    const detectedObjects = DroneUtils.detectObjects(image);
    Logger.log(`Detected ${detectedObjects.length} object(s) on drone ${this.droneID}.`);
    return detectedObjects;
  }

  classifyAndFilterObjects(objects, filterCriteria = {}) {
    if (!objects.length) return [];

    const classifiedObjects = objects.map(obj => ({
      ...obj,
      classification: DroneUtils.classifyObject(obj)
    }));

    Logger.log(`Classified ${classifiedObjects.length} object(s) on drone ${this.droneID}.`);

    if (Object.keys(filterCriteria).length > 0) {
      const filteredObjects = classifiedObjects.filter(obj =>
        Object.entries(filterCriteria).every(([key, value]) => obj[key] === value)
      );
      Logger.log(`Filtered to ${filteredObjects.length} object(s) based on criteria.`);
      return filteredObjects;
    }

    return classifiedObjects;
  }

  detectAndClassifyFromDistance(distance) {
    if (!this.cameraActive || !this.modelLoaded) return [];

    let zoomFactor = 1;
    if (distance > 50) zoomFactor = 1.5;
    if (distance > 100) zoomFactor = 2.0;

    const image = DroneUtils.captureImageWithZoom(this.droneID, zoomFactor);
    if (!image) return [];

    const detectedObjects = DroneUtils.detectObjects(image);
    if (detectedObjects.length > 0) {
      Logger.log(`Objects detected at distance ${distance} meters using zoom factor ${zoomFactor}.`);
    }

    const classifiedObjects = this.classifyAndFilterObjects(detectedObjects);
    Logger.log(`Classified objects detected at distance ${distance}:`, classifiedObjects);
    return classifiedObjects;
  }

  detectSpecificObject(objectType, distance) {
    const detectedObjects = this.detectAndClassifyFromDistance(distance);
    const specificObjects = detectedObjects.filter(obj => obj.classification === objectType);
    Logger.log(`Detected ${specificObjects.length} "${objectType}" object(s) at distance ${distance}.`);
    return specificObjects;
  }
}

module.exports = ObjectDetection;
