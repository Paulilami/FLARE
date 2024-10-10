const UDPManager = require('../udp/UDPManager');
const EventEmitter = require('events');
const Logger = require('../../utils/Logger');

class GossipProtocol extends EventEmitter {
  constructor() {
    super();
    this.peers = {};
    this.heartbeatInterval = null;
    this.heartbeatFrequency = 5000; 
  }

  initialize(droneID) {
    if (!this.peers[droneID]) {
      this.peers[droneID] = { droneID, status: 'active', lastSeen: Date.now() };
      Logger.log(`Drone ${droneID} initialized in Gossip Protocol.`);
    }

    this.monitorHeartbeat();
    UDPManager.on('unknown_peer', (peerID, message) => this.handleUnknownPeer(peerID, message));
    UDPManager.on('message', (message, rinfo) => this.receiveMessage(rinfo.address, message));
  }

  addPeer(droneID, address, port) {
    if (this.peers[droneID]) {
      Logger.warn(`Peer ${droneID} already exists. Updating peer information.`);
    }
    this.peers[droneID] = { droneID, address, port, status: 'active', lastSeen: Date.now() };
    UDPManager.addPeer(droneID, address, port, this.receiveMessage.bind(this));
    Logger.log(`Peer ${droneID} added with address ${address}:${port}.`);
  }

  handleUnknownPeer(peerID, message) {
    Logger.warn(`Unknown peer detected: ${peerID}. Message: ${message}`);
    const newPeer = this.parseNewPeerInfo(message);
    if (newPeer) {
      this.addPeer(newPeer.droneID, newPeer.address, newPeer.port);
    }
  }

  parseNewPeerInfo(message) {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.droneID && parsedMessage.address && parsedMessage.port) {
        return parsedMessage;
      }
      return null;
    } catch (err) {
      Logger.error(`Failed to parse new peer info: ${message}`);
      return null;
    }
  }

  sendMessage(senderID, message) {
    const sender = this.peers[senderID];
    if (sender) {
      const gossipMessage = JSON.stringify({ senderID, message, timestamp: Date.now() });
      UDPManager.sendMessage(senderID, gossipMessage);
      Logger.log(`Message from ${senderID} sent to neighbors: ${message}`);
    }
  }

  receiveMessage(senderID, message) {
    Logger.log(`Message received from ${senderID}: ${message}`);
    try {
      const parsedMessage = JSON.parse(message);
      this.peers[senderID].lastSeen = Date.now();
      this.emit('message_received', senderID, parsedMessage.message);
      this.gossip(senderID, parsedMessage.message); // Propagate the message to other peers
    } catch (err) {
      Logger.error(`Failed to parse message from ${senderID}: ${err.message}`);
    }
  }

  gossip(senderID, message) {
    Object.keys(this.peers).forEach(peerID => {
      if (peerID !== senderID) {
        this.sendMessage(peerID, message);
      }
    });
  }

  monitorHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      Object.keys(this.peers).forEach(droneID => {
        if (now - this.peers[droneID].lastSeen > this.heartbeatFrequency * 2) {
          Logger.warn(`Drone ${droneID} is considered inactive. Last seen at ${new Date(this.peers[droneID].lastSeen).toISOString()}.`);
          this.peers[droneID].status = 'inactive';
          this.emit('peer_inactive', droneID);
        } else {
          this.sendHeartbeat(droneID);
        }
      });
    }, this.heartbeatFrequency);
  }

  sendHeartbeat(droneID) {
    if (this.peers[droneID] && this.peers[droneID].status === 'active') {
      const heartbeatMessage = JSON.stringify({ type: 'heartbeat', droneID, timestamp: Date.now() });
      UDPManager.sendMessage(droneID, heartbeatMessage);
      Logger.log(`Heartbeat sent to ${droneID}.`);
    }
  }

  updateStatus(droneID, status) {
    if (this.peers[droneID]) {
      this.peers[droneID].status = status;
      Logger.log(`Drone ${droneID} status updated to ${status}.`);
    } else {
      Logger.warn(`Attempted to update status for unknown drone ${droneID}.`);
    }
  }

  getPeerStatus(droneID) {
    return this.peers[droneID] ? this.peers[droneID].status : 'unknown';
  }

  broadcast(message) {
    Object.keys(this.peers).forEach(droneID => {
      this.sendMessage(droneID, message);
    });
  }

  terminate() {
    clearInterval(this.heartbeatInterval);
    this.peers = {};
    UDPManager.terminateServer();
    Logger.log('Gossip Protocol terminated and all peers removed.');
  }
}

module.exports = new GossipProtocol();
