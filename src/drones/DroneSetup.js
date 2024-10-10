// src/drones/DroneSetup.js

const peers = [];
let droneID = '';
let status = 'inactive';

const initializeDrone = (id, port) => {
  droneID = id;
  const udpServer = dgram.createSocket('udp4');
  udpServer.bind(port, () => {
    status = 'active';
  });
};

const addPeer = (ip, port) => {
  if (!peers.some(peer => peer.ip === ip && peer.port === port)) {
    peers.push({ ip, port });
    console.log(`[INFO] Registered new peer: ${ip}:${port}`);
  }
};

const getPeers = () => peers;

module.exports = { initializeDrone, addPeer, getPeers };
