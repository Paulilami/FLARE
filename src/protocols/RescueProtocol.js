const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class RescueProtocol {
  static run(context) {
    const rescueDrones = DroneRegister.getAllDrones().filter(drone => drone.role === 'search' || drone.role === 'front');
    if (rescueDrones.length === 0) {
      Logger.warn('No drones available for the rescue operation.');
      return;
    }

    Logger.log(`Rescue Protocol initiated with ${rescueDrones.length} rescue drone(s).`);

    rescueDrones.forEach(drone => {
      drone.activate();

      const { targetLocation, emergencyMode } = context.parameters || {};

      if (targetLocation) {
        drone.moveToLocation(targetLocation);
        Logger.log(`Drone ${drone.droneID} moving to rescue target location: ${JSON.stringify(targetLocation)}`);
      } else {
        Logger.log(`Drone ${drone.droneID} scanning area for target.`);
        drone.scanArea({ radius: context.parameters?.searchRadius || 50 });
      }

      if (DroneUtils.hasCamera(drone.droneID)) {
        const image = DroneUtils.captureImage(drone.droneID);
        const faces = DroneUtils.detectFaces(image);

        if (faces.length > 0) {
          Logger.log(`Target identified by drone ${drone.droneID}. Executing rescue operation.`);
          drone.hoverAndSignal();
        }
      }

      if (emergencyMode) {
        drone.initiateEmergencyMode();
        Logger.log(`Emergency mode activated for drone ${drone.droneID}.`);
      }
    });

    Logger.log('Rescue Protocol executed successfully.');
  }

  static configure(settings) {
    Logger.log(`Rescue Protocol configured with settings: ${JSON.stringify(settings)}`);
  }
}

module.exports = RescueProtocol;
