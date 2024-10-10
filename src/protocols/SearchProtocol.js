const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');

class SearchProtocol {
  static run(context) {
    const searchDrones = DroneRegister.getAllDrones().filter(drone => drone.role === 'search');
    Logger.log(`Search Protocol initiated with ${searchDrones.length} search drone(s).`);

    searchDrones.forEach(drone => {
      drone.scanArea();
    });

    Logger.log('Search Protocol executed successfully.');
  }

  static configure(settings) {
    Logger.log(`Search Protocol configured with settings: ${JSON.stringify(settings)}`);
  }
}

module.exports = SearchProtocol;
