// src/communication/udp/UDPManager.js

const dgram = require('dgram');
const { handleMessage, setSendMessageHandler } = require('../gossip/GossipProtocol');

const udpServer = dgram.createSocket('udp4');
const PORT = process.env.UDP_SERVER_PORT || 5000;

const initUDPServer = () => {
  udpServer.bind(PORT, () => {
    setSendMessageHandler(sendUDPMessage);
  });
  udpServer.on('message', (msg, rinfo) => handleMessage(msg, rinfo));
};

const sendUDPMessage = (message, targetPort, targetHost) => {
  udpServer.send(Buffer.from(message), targetPort, targetHost);
};

module.exports = { initUDPServer, sendUDPMessage };
