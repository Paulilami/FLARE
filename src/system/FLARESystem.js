const DroneManager = require('../drones/DroneManager');
const DroneRegister = require('../drones/DroneRegister');
const Logger = require('../utils/Logger');
const RoleManager = require('./RoleManager');
const ConfigManager = require('../utils/ConfigManager');
const GossipProtocol = require('../communication/gossip/GossipProtocol');

class FLARESystem {
  initialize(droneIDs) {
    droneIDs.forEach(id => {
      DroneManager.initializeDrone(id);
    });
    Logger.log('FLARE System initialized with drones: ' + droneIDs.join(', '));
  }

  addDrone(droneID, dronePort) {
    DroneManager.initializeDrone(droneID);
    GossipProtocol.initialize(droneID);
    ConfigManager.updateDroneConfig(droneID, { port: dronePort });
    Logger.log(`Drone ${droneID} added to FLARE System on port ${dronePort}.`);
  }

  start() {
    DroneRegister.getAllDrones().forEach(drone => {
      drone.activate();
      GossipProtocol.initialize(drone.droneID);
    });
    Logger.log('All drones have been started and communication initialized.');
  }

  assignRoles() {
    RoleManager.assignRoles();
    Logger.log('Roles have been assigned to all active drones.');
  }

  monitorSystem() {
    setInterval(() => {
      DroneRegister.getAllDrones().forEach(drone => {
        const status = drone.getStatus();
        Logger.log(`Drone ${drone.droneID} status: ${JSON.stringify(status)}`);
      });
    }, ConfigManager.getConfig().system.monitorInterval * 1000);
    Logger.log('System monitoring started.');
  }

  stop() {
    DroneRegister.getAllDrones().forEach(drone => {
      drone.deactivate();
    });
    Logger.log('All drones have been stopped.');
  }
}

module.exports = new FLARESystem();
