const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');

class SurveillanceProtocol {
  static run(context) {
    const surveillanceDrones = DroneRegister.getAllDrones().filter(drone => drone.role === 'front' || drone.role === 'back');
    Logger.log(`Surveillance Protocol initiated with ${surveillanceDrones.length} drone(s).`);

    surveillanceDrones.forEach(drone => {
      if (context.patrolRoute) {
        drone.followRoute(context.patrolRoute);
      } else {
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
