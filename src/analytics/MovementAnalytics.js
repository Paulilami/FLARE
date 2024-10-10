const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class MovementAnalytics {
  constructor(droneID) {
    this.droneID = droneID;
    this.movementData = [];
  }

  trackMovement() {
    const currentPosition = DroneUtils.getPosition(this.droneID);
    if (currentPosition) {
      this.movementData.push(currentPosition);
      Logger.log(`Position recorded for drone ${this.droneID}: ${JSON.stringify(currentPosition)}`);
    }
  }

  analyzePatterns() {
    if (this.movementData.length < 2) {
      Logger.log(`Insufficient movement data for drone ${this.droneID} to analyze patterns.`);
      return null;
    }

    const speedData = this.calculateSpeed();
    const directionChanges = this.detectDirectionChanges();

    const patterns = {
      speedData,
      directionChanges,
      pathLength: this.calculateTotalPathLength()
    };

    Logger.log(`Movement patterns analyzed for drone ${this.droneID}.`);
    return patterns;
  }

  calculateSpeed() {
    const speedData = [];
    for (let i = 1; i < this.movementData.length; i++) {
      const prev = this.movementData[i - 1];
      const curr = this.movementData[i];
      const distance = DroneUtils.calculateDistance(prev, curr);
      const timeDiff = (curr.timestamp - prev.timestamp) / 1000;
      const speed = timeDiff > 0 ? distance / timeDiff : 0;
      speedData.push({ timestamp: curr.timestamp, speed });
    }
    Logger.log(`Speed calculated for drone ${this.droneID}.`);
    return speedData;
  }

  detectDirectionChanges() {
    const directionChanges = [];
    for (let i = 2; i < this.movementData.length; i++) {
      const prevDirection = DroneUtils.calculateDirection(this.movementData[i - 2], this.movementData[i - 1]);
      const currDirection = DroneUtils.calculateDirection(this.movementData[i - 1], this.movementData[i]);
      if (prevDirection !== currDirection) {
        directionChanges.push({
          timestamp: this.movementData[i].timestamp,
          from: prevDirection,
          to: currDirection
        });
      }
    }
    Logger.log(`Direction changes detected for drone ${this.droneID}.`);
    return directionChanges;
  }

  calculateTotalPathLength() {
    let totalDistance = 0;
    for (let i = 1; i < this.movementData.length; i++) {
      totalDistance += DroneUtils.calculateDistance(this.movementData[i - 1], this.movementData[i]);
    }
    Logger.log(`Total path length calculated for drone ${this.droneID}.`);
    return totalDistance;
  }

  clearMovementData() {
    this.movementData = [];
    Logger.log(`Movement data cleared for drone ${this.droneID}.`);
  }
}

module.exports = MovementAnalytics;
