const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');
const DroneUtils = require('../utils/DroneUtils');

class SearchProtocol {
  static run(context) {
    const searchDrones = DroneRegister.getAllDrones().filter(drone => drone.role === 'search');
    if (searchDrones.length === 0) {
      Logger.warn('No drones assigned to the search role.');
      return;
    }

    Logger.log(`Search Protocol initiated with ${searchDrones.length} drone(s).`);

    searchDrones.forEach(drone => {
      drone.activate();
      const { maxDistance, scanPattern, targetRecognition } = context.parameters || {};

      if (DroneUtils.hasCamera(drone.droneID) && targetRecognition) {
        const image = DroneUtils.captureImage(drone.droneID);
        const processedImage = DroneUtils.processImage(image);
        const targets = DroneUtils.detectObjects(processedImage.details);
        
        if (targets.length > 0) {
          Logger.log(`Target detected by drone ${drone.droneID}. Initiating response action.`);
          drone.sendSignal('target-found', targets);
        }
      }

      drone.scanArea({ distance: maxDistance || 100, pattern: scanPattern || 'grid' });
    });

    Logger.log('Search Protocol executed successfully.');
  }

  static configure(settings) {
    Logger.log(`Search Protocol configured with settings: ${JSON.stringify(settings)}`);
  }
}

module.exports = SearchProtocol;
