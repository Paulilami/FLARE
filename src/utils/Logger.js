// src/utils/Logger.js

const log = (level, message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
  };
  
  const info = (message) => log('info', message);
  const error = (message) => log('error', message);
  const debug = (message) => log('debug', message);
  
  module.exports = { info, error, debug };
  