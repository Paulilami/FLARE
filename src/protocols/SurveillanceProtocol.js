const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class SurveillanceProtocol {
  static run(context) {
    const surveillanceDrones = DroneRegister.getAllDrones().filter(drone => drone.role === 'front' || drone.role === 'back');
    if (surveillanceDrones.length === 0) {
      Logger.warn('No drones available for surveillance.');
      return;
    }

    Logger.log(`Surveillance Protocol initiated with ${surveillanceDrones.length} surveillance drone(s).`);

    surveillanceDrones.forEach(drone => {
      drone.activate();

      const { patrolRoute, recordingEnabled, motionDetection } = context.parameters || {};

      if (recordingEnabled && DroneUtils.hasCamera(drone.droneID)) {
        const image = DroneUtils.captureImage(drone.droneID);
        Logger.log(`Recording enabled for drone ${drone.droneID}. Capturing and analyzing image data.`);

        if (motionDetection) {
          const objects = DroneUtils.detectObjects(image);
          if (objects.length > 0) {
            Logger.log(`Motion detected by drone ${drone.droneID}. Initiating alert response.`);
            drone.sendSignal('motion-detected', objects);
          }
        }
      }

      if (patrolRoute && Array.isArray(patrolRoute)) {
        Logger.log(`Drone ${drone.droneID} following patrol route: ${JSON.stringify(patrolRoute)}`);
        drone.followRoute(patrolRoute);
      } else {
        Logger.log(`Drone ${drone.droneID} hovering and monitoring assigned area.`);
        drone.hoverAndMonitor();
      }
    });

    Logger.log('Surveillance Protocol executed successfully.');
  }

  static configure(settings) {
    Logger.log(`Surveillance Protocol configured with settings: ${JSON.stringify(settings)}`);
  }
}

module.exports = SurveillanceProtocol;
