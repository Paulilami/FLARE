// src/drones/DroneControl.js

const { getPeers } = require('./DroneSetup');
const { sendUDPMessage } = require('../communication/udp/UDPManager');

const startCommand = () => {
  const peers = getPeers();
  if (peers.length === 0) {
    console.log('[ERROR] No peers found. Please ensure drones are correctly registered.');
    return;
  }
  console.log('[INFO] Sending start command to the following peers:', peers); // Log peers to confirm registration
  const message = JSON.stringify({ type: 'command', action: 'start' });
  peers.forEach(peer => {
    console.log(`[INFO] Sending start command to peer at ${peer.ip}:${peer.port}`);
    sendUDPMessage(message, peer.port, peer.ip);
  });
};

module.exports = { startCommand };
