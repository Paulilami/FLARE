const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class FaceIDHandler {
  constructor(droneID) {
    this.droneID = droneID;
    this.cameraActive = false;
    this.modelLoaded = false;
  }

  initialize() {
    if (DroneUtils.hasCamera(this.droneID)) {
      this.cameraActive = true;
      this.loadModel();
      Logger.log(`Face ID handler initialized for drone ${this.droneID}.`);
    } else {
      Logger.error(`Drone ${this.droneID} does not have a camera.`);
    }
  }

  loadModel() {
    this.modelLoaded = DroneUtils.loadFaceIDModel();
    if (this.modelLoaded) {
      Logger.log(`Face ID model loaded successfully on drone ${this.droneID}.`);
    } else {
      Logger.error(`Failed to load Face ID model on drone ${this.droneID}.`);
    }
  }

  captureImage() {
    if (this.cameraActive) {
      const image = DroneUtils.captureImage(this.droneID);
      Logger.log(`Image captured by drone ${this.droneID} for Face ID processing.`);
      return image;
    } else {
      Logger.error(`Camera not active on drone ${this.droneID}.`);
      return null;
    }
  }

  detectFaces(image) {
    if (this.modelLoaded && image) {
      const faces = DroneUtils.detectFaces(image);
      Logger.log(`Faces detected by drone ${this.droneID}: ${faces.length} face(s) found.`);
      return faces;
    } else {
      Logger.error(`Face detection failed for drone ${this.droneID}.`);
      return [];
    }
  }

  identifyFaces(faces) {
    if (this.modelLoaded && faces.length > 0) {
      const identities = faces.map(face => DroneUtils.identifyFace(face));
      Logger.log(`Identified faces by drone ${this.droneID}.`);
      return identities;
    }
    Logger.error(`No faces to identify for drone ${this.droneID}.`);
    return [];
  }

  detectAndIdentifyFromDistance(distance) {
    if (!this.cameraActive || !this.modelLoaded) return [];

    let zoomFactor = 1;
    if (distance > 50) zoomFactor = 1.5;
    if (distance > 100) zoomFactor = 2.0;

    const image = DroneUtils.captureImageWithZoom(this.droneID, zoomFactor);
    if (!image) return [];

    const faces = this.detectFaces(image);
    if (faces.length > 0) {
      Logger.log(`Faces detected at distance ${distance} meters using zoom factor ${zoomFactor}.`);
    }
    return this.identifyFaces(faces);
  }
}

module.exports = FaceIDHandler;
