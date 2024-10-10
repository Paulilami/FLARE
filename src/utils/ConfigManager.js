// src/utils/ConfigManager.js

const fs = require('fs');
const configPath = './config/default.json';
let configData = require('../../config/default.json');

const getConfig = (key) => key ? configData[key] : configData;

const setConfig = (key, value) => {
  configData[key] = value;
  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
};

module.exports = { getConfig, setConfig };
