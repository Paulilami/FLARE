const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class EnvironmentAnalysis {
  constructor(droneID) {
    this.droneID = droneID;
    this.sensorsActive = false;
    this.environmentData = {};
  }

  initialize() {
    if (DroneUtils.hasSensors(this.droneID)) {
      this.sensorsActive = true;
      Logger.log(`Environment analysis initialized for drone ${this.droneID}.`);
    } else {
      Logger.error(`Drone ${this.droneID} does not have sensors for environment analysis.`);
    }
  }

  captureEnvironmentData() {
    if (!this.sensorsActive) {
      Logger.error(`Sensors not active on drone ${this.droneID}. Cannot capture environment data.`);
      return null;
    }

    const data = DroneUtils.readEnvironmentData(this.droneID);
    if (data) {
      this.environmentData = data;
      Logger.log(`Environment data captured by drone ${this.droneID}: ${JSON.stringify(this.environmentData)}`);
    } else {
      Logger.error(`Failed to capture environment data for drone ${this.droneID}.`);
    }
    return this.environmentData;
  }

  analyzeTerrain() {
    if (!this.environmentData || Object.keys(this.environmentData).length === 0) {
      Logger.error(`No environment data available for terrain analysis on drone ${this.droneID}.`);
      return null;
    }

    const terrainType = DroneUtils.identifyTerrain(this.environmentData);
    Logger.log(`Terrain type identified as "${terrainType}" by drone ${this.droneID}.`);
    return terrainType;
  }

  detectObstacles() {
    if (!this.environmentData || Object.keys(this.environmentData).length === 0) {
      Logger.error(`No environment data available for obstacle detection on drone ${this.droneID}.`);
      return [];
    }

    const obstacles = DroneUtils.detectObstacles(this.environmentData);
    Logger.log(`Detected ${obstacles.length} obstacle(s) in the environment by drone ${this.droneID}.`);
    return obstacles;
  }

  evaluateWeatherConditions() {
    if (!this.environmentData || Object.keys(this.environmentData).length === 0) {
      Logger.error(`No environment data available for weather analysis on drone ${this.droneID}.`);
      return null;
    }

    const weather = DroneUtils.analyzeWeather(this.environmentData);
    Logger.log(`Weather conditions evaluated as "${weather.condition}" with temperature: ${weather.temperature}°C by drone ${this.droneID}.`);
    return weather;
  }
}

module.exports = EnvironmentAnalysis;
