const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');

class RescueProtocol {
  static run(context) {
    const rescueDrones = DroneRegister.getAllDrones().filter(drone => drone.role === 'search' || drone.role === 'front');
    Logger.log(`Rescue Protocol initiated with ${rescueDrones.length} rescue drone(s).`);

    rescueDrones.forEach(drone => {
      if (context.targetLocation) {
        drone.moveToLocation(context.targetLocation);
      } else {
        drone.scanArea();
      }
    });

    Logger.log('Rescue Protocol executed successfully.');
  }

  static configure(settings) {
    Logger.log(`Rescue Protocol configured with settings: ${JSON.stringify(settings)}`);
  }
}

module.exports = RescueProtocol;
