const UDPManager = require('../udp/UDPManager');
const DroneRegister = require('../../drones/DroneRegister');
const Logger = require('../../utils/Logger');

class GossipProtocol {
  constructor() {
    this.peers = {};
  }

  initialize(droneID) {
    const drone = DroneRegister.getDrone(droneID);
    if (drone) {
      this.peers[droneID] = drone;
      Logger.log(`Drone ${droneID} added to Gossip Protocol.`);
    }
  }

  sendMessage(senderID, message) {
    const sender = this.peers[senderID];
    if (sender) {
      const neighbors = this.getNeighbors(senderID);
      neighbors.forEach(neighbor => {
        UDPManager.send(neighbor.address, message);
      });
      Logger.log(`Message from ${senderID} sent to neighbors.`);
    }
  }

  receiveMessage(senderID, message) {
    Logger.log(`Message received from ${senderID}: ${message}`);
    if (!this.peers[senderID]) {
      this.peers[senderID] = { droneID: senderID, status: 'active' };
      Logger.log(`New drone ${senderID} added to Gossip Protocol.`);
    }
  }

  getNeighbors(droneID) {
    return Object.values(this.peers).filter(drone => drone.droneID !== droneID);
  }

  updateStatus(droneID, status) {
    if (this.peers[droneID]) {
      this.peers[droneID].status = status;
      Logger.log(`Drone ${droneID} status updated to ${status}.`);
    }
  }

  broadcast(message) {
    Object.keys(this.peers).forEach(droneID => {
      this.sendMessage(droneID, message);
    });
  }
}

module.exports = new GossipProtocol();
