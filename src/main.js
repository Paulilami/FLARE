// src/main.js

const { initUDPServer } = require('./communication/udp/UDPManager');
const { registerPeer } = require('./communication/gossip/GossipProtocol');
const { initializeDrone, getStatus } = require('./drones/DroneSetup');
const { startCommand } = require('./drones/DroneControl');
const { info } = require('./utils/Logger');

const initFLARE = () => {
  const droneID = process.env.DRONE_ID || `drone${Math.floor(Math.random() * 100)}`;
  const port = process.env.UDP_CLIENT_PORT || 6001;

  initUDPServer();
  initializeDrone(droneID, port);
  registerPeer('localhost', port);  // Register itself as a peer
  
  console.log(`[INFO] Drone ${droneID} initialized and registered as a peer at localhost:${port}`);

  setTimeout(() => {
    info(`Drone ${droneID} initialized with status: ${getStatus()}`);
  }, 500);
};

initFLARE();
