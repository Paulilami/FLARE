// tests/drone-tests/DroneSetup.test.js

const { initializeDrone, addPeer, getPeers, getStatus } = require('../../src/drones/DroneSetup');
const assert = require('assert');

describe('DroneSetup Tests', () => {
  it('should initialize the drone and set status to active', (done) => {
    initializeDrone('drone1', 6001);
    setTimeout(() => {
      assert.strictEqual(getStatus(), 'active');
      done();
    }, 100);  // Short delay to allow async bind operation to complete
  });

  it('should add a new peer to the peers list', () => {
    addPeer('localhost', 6002);
    const peers = getPeers();
    assert.strictEqual(peers.length, 1);
    assert.deepStrictEqual(peers[0], { ip: 'localhost', port: 6002 });
  });

  it('should not add duplicate peers', () => {
    addPeer('localhost', 6002);
    const peers = getPeers();
    assert.strictEqual(peers.length, 1);
  });
});
