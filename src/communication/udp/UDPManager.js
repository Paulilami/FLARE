const dgram = require('dgram');
const EventEmitter = require('events');
const Logger = require('../../utils/Logger');

class UDPManager extends EventEmitter {
  constructor() {
    super();
    this.server = dgram.createSocket('udp4');
    this.peers = {};
    this.serverActive = false;
  }

  initializeServer(port) {
    if (this.serverActive) {
      Logger.warn(`UDP server is already running on port ${this.server.address().port}.`);
      return;
    }

    this.server.on('message', (msg, rinfo) => {
      const message = msg.toString();
      const senderID = `${rinfo.address}:${rinfo.port}`;
      Logger.log(`Message received from ${senderID}: ${message}`);
      if (this.peers[senderID]) {
        this.peers[senderID].onMessage(message, senderID);
      } else {
        Logger.warn(`Unknown peer ${senderID} attempted to send a message.`);
        this.emit('unknown_peer', senderID, message);
      }
    });

    this.server.on('error', (err) => {
      Logger.error(`UDP server error: ${err.message}`);
      this.server.close();
      this.serverActive = false;
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      Logger.log(`UDP server listening on ${address.address}:${address.port}`);
      this.serverActive = true;
      this.emit('server_initialized', address);
    });

    this.server.bind(port);
  }

  addPeer(peerID, address, port, onMessage) {
    if (this.peers[peerID]) {
      Logger.warn(`Peer ${peerID} already exists. Updating peer info.`);
    }
    this.peers[peerID] = { address, port, onMessage };
    Logger.log(`Peer ${peerID} added with address ${address}:${port}.`);
  }

  removePeer(peerID) {
    if (this.peers[peerID]) {
      delete this.peers[peerID];
      Logger.log(`Peer ${peerID} removed.`);
    } else {
      Logger.warn(`Attempted to remove non-existing peer: ${peerID}.`);
    }
  }

  sendMessage(peerID, message) {
    if (!this.peers[peerID]) {
      Logger.error(`Cannot send message. Peer ${peerID} not found.`);
      return;
    }
    const peer = this.peers[peerID];
    this.server.send(message, 0, message.length, peer.port, peer.address, (err) => {
      if (err) {
        Logger.error(`Failed to send message to ${peerID} at ${peer.address}:${peer.port}`);
      } else {
        Logger.log(`Message sent to ${peerID} at ${peer.address}:${peer.port}`);
      }
    });
  }

  broadcast(message) {
    Object.keys(this.peers).forEach((peerID) => {
      this.sendMessage(peerID, message);
    });
  }

  receiveMessage(senderID, message) {
    if (this.peers[senderID]) {
      this.peers[senderID].onMessage(message);
    } else {
      Logger.warn(`Received message from unknown sender: ${senderID}`);
      this.emit('unknown_message', senderID, message);
    }
  }

  getPeerList() {
    return Object.keys(this.peers).map(peerID => ({
      peerID,
      address: this.peers[peerID].address,
      port: this.peers[peerID].port
    }));
  }

  terminateServer() {
    if (this.serverActive) {
      this.server.close(() => {
        Logger.log('UDP server closed successfully.');
        this.serverActive = false;
        this.emit('server_terminated');
      });
    } else {
      Logger.warn('UDP server is not active. Nothing to terminate.');
    }
  }

  retrySend(peerID, message, retries = 3, delay = 1000) {
    const attemptSend = (remainingRetries) => {
      if (remainingRetries === 0) {
        Logger.error(`Failed to send message to ${peerID} after multiple attempts.`);
        return;
      }
      Logger.log(`Attempting to send message to ${peerID}. Retries left: ${remainingRetries}`);
      this.sendMessage(peerID, message);
      setTimeout(() => attemptSend(remainingRetries - 1), delay);
    };
    attemptSend(retries);
  }

  enableMessageEncryption(encryptionKey) {
    if (!encryptionKey) {
      Logger.error('Encryption key not provided.');
      return;
    }
    this.on('message', (message, rinfo) => {
      const decryptedMessage = this.decryptMessage(message, encryptionKey);
      this.emit('decrypted_message', decryptedMessage, rinfo);
    });
    Logger.log('Message encryption enabled.');
  }

  encryptMessage(message, key) {
    //Placeholder 
    return Buffer.from(message).toString('base64'); 
  }

  decryptMessage(encryptedMessage, key) {
    //Placeholder 
    return Buffer.from(encryptedMessage, 'base64').toString('utf-8');
  }
}

module.exports = new UDPManager();
