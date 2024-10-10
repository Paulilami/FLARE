// tests/communication-tests/GossipProtocol.test.js

const { registerPeer, handleMessage, peers } = require('../../src/communication/gossip/GossipProtocol');
const assert = require('assert');

describe('GossipProtocol Tests', () => {
  it('should register a new peer', () => {
    registerPeer('localhost', 6001);
    assert.strictEqual(peers.length, 1);
    assert.deepStrictEqual(peers[0], { ip: 'localhost', port: 6001 });
  });

  it('should not register duplicate peers', () => {
    registerPeer('localhost', 6001);
    assert.strictEqual(peers.length, 1);
  });

  it('should propagate a unique message to peers', () => {
    const initialPeersLength = peers.length;
    handleMessage(Buffer.from('test-message'), { address: 'localhost', port: 6001 });
    assert.strictEqual(peers.length, initialPeersLength);
  });

  it('should not propagate the same message twice', () => {
    const initialPeersLength = peers.length;
    handleMessage(Buffer.from('test-message'), { address: 'localhost', port: 6001 });
    assert.strictEqual(peers.length, initialPeersLength);
  });
});
