class Validator {
  static isValidDroneID(droneID) {
    return typeof droneID === 'string' && droneID.trim().length > 0 && /^[a-zA-Z0-9-_]+$/.test(droneID);
  }

  static isValidPort(port) {
    return Number.isInteger(port) && port > 1024 && port <= 65535;
  }

  static isValidRole(role) {
    const validRoles = ['search', 'front', 'back'];
    return validRoles.includes(role);
  }

  static isValidCommand(command) {
    const validCommands = ['start', 'fly', 'find', 'stop', 'add', 'configure', 'monitor'];
    return validCommands.includes(command);
  }

  static isValidProtocol(protocol) {
    const validProtocols = ['search', 'rescue', 'surveillance'];
    return validProtocols.includes(protocol);
  }

  static isNonEmptyArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
  }

  static isValidIP(ip) {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
  }

  static isValidAPIKey(key) {
    return typeof key === 'string' && key.length >= 32;
  }
}

module.exports = Validator;
