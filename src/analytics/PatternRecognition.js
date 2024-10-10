const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class PatternRecognition {
  constructor(droneID) {
    this.droneID = droneID;
    this.modelLoaded = false;
  }

  initialize() {
    this.modelLoaded = DroneUtils.loadPatternRecognitionModel();
    if (this.modelLoaded) {
      Logger.log(`Pattern recognition model initialized for drone ${this.droneID}.`);
    } else {
      Logger.error(`Failed to initialize pattern recognition model for drone ${this.droneID}.`);
    }
  }

  recognizePatterns(image) {
    if (!this.modelLoaded || !image) {
      Logger.error(`Pattern recognition failed on drone ${this.droneID}. Model not loaded or image missing.`);
      return [];
    }

    const patterns = DroneUtils.detectPatterns(image);
    Logger.log(`Detected ${patterns.length} pattern(s) by drone ${this.droneID}.`);
    return patterns;
  }

  identifySpecificPattern(image, patternType) {
    if (!this.modelLoaded || !image) {
      Logger.error(`Pattern recognition failed for type "${patternType}" on drone ${this.droneID}.`);
      return null;
    }

    const specificPattern = DroneUtils.identifyPattern(image, patternType);
    if (specificPattern) {
      Logger.log(`Pattern "${patternType}" identified by drone ${this.droneID}.`);
    } else {
      Logger.log(`Pattern "${patternType}" not found by drone ${this.droneID}.`);
    }
    return specificPattern;
  }

  recognizeAndTrackPattern(image, patternType) {
    const pattern = this.identifySpecificPattern(image, patternType);
    if (pattern) {
      const trackingData = DroneUtils.trackPattern(this.droneID, pattern);
      Logger.log(`Pattern "${patternType}" tracked by drone ${this.droneID}.`);
      return trackingData;
    }
    return null;
  }
}

module.exports = PatternRecognition;
