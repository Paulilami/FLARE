// src/communication/gossip/GossipProtocol.js

const peers = [];
const messageHistory = new Set();
let sendMessageHandler;

const registerPeer = (ip, port) => {
  if (!peers.some(peer => peer.ip === ip && peer.port === port)) {
    peers.push({ ip, port });
    console.log(`[INFO] Registered new peer: ${ip}:${port}`);
  }
};

const setSendMessageHandler = (handler) => {
  sendMessageHandler = handler;
};

const propagateMessage = (message) => {
  if (sendMessageHandler) {
    peers.forEach(peer => {
      sendMessageHandler(message, peer.port, peer.ip);
    });
  }
};

const handleMessage = (msg, rinfo) => {
  const message = msg.toString();
  const parsedMessage = JSON.parse(message);

  if (parsedMessage.type === 'command' && parsedMessage.action === 'start') {
    console.log(`[INFO] Received start command from ${rinfo.address}:${rinfo.port}`);
    propagateMessage(message);
  } else if (!messageHistory.has(message)) {
    messageHistory.add(message);
    propagateMessage(message);
  }
};

module.exports = { registerPeer, handleMessage, setSendMessageHandler, peers };
