const dgram = require('dgram');
const Logger = require('../../utils/Logger');

class UDPManager {
  constructor() {
    this.server = dgram.createSocket('udp4');
    this.peers = {};

    this.server.on('message', (msg, rinfo) => {
      const message = msg.toString();
      const senderID = `${rinfo.address}:${rinfo.port}`;
      Logger.log(`Message received from ${senderID}: ${message}`);
      if (this.peers[senderID]) {
        this.peers[senderID].onMessage(message);
      }
    });

    this.server.on('error', (err) => {
      Logger.error(`UDP server error: ${err.message}`);
      this.server.close();
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      Logger.log(`UDP server listening on ${address.address}:${address.port}`);
    });
  }

  addPeer(peerID, address, port, onMessage) {
    this.peers[peerID] = { address, port, onMessage };
    Logger.log(`Peer ${peerID} added with address ${address}:${port}.`);
  }

  removePeer(peerID) {
    delete this.peers[peerID];
    Logger.log(`Peer ${peerID} removed.`);
  }

  send(address, message) {
    this.server.send(message, 0, message.length, address.port, address.address, (err) => {
      if (err) {
        Logger.error(`Failed to send message to ${address.address}:${address.port}`);
      } else {
        Logger.log(`Message sent to ${address.address}:${address.port}`);
      }
    });
  }

  bind(port) {
    this.server.bind(port);
  }

  close() {
    this.server.close();
    Logger.log('UDP server closed.');
  }
}

module.exports = new UDPManager();
