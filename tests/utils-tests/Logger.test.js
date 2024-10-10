const { info, error, debug } = require('../../src/utils/Logger');
const assert = require('assert');
const sinon = require('sinon');

describe('Logger Tests', () => {
  let consoleLogStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    consoleLogStub.restore();
  });

  it('should log an info message', () => {
    info('This is an info message');
    assert(consoleLogStub.calledOnce);
    assert(consoleLogStub.calledWithMatch(/\[INFO\]: This is an info message/));
  });

  it('should log an error message', () => {
    error('This is an error message');
    assert(consoleLogStub.calledOnce);
    assert(consoleLogStub.calledWithMatch(/\[ERROR\]: This is an error message/));
  });

  it('should log a debug message', () => {
    debug('This is a debug message');
    assert(consoleLogStub.calledOnce);
    assert(consoleLogStub.calledWithMatch(/\[DEBUG\]: This is a debug message/));
  });
});
