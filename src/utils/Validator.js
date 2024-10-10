class Validator {
    static isValidDroneID(droneID) {
      return typeof droneID === 'string' && droneID.trim().length > 0;
    }
  
    static isValidRole(role) {
      const validRoles = ['search', 'front', 'back'];
      return validRoles.includes(role);
    }
  
    static isValidCommand(command) {
      const validCommands = ['start', 'fly', 'find', 'stop'];
      return validCommands.includes(command);
    }
  
    static isValidProtocol(protocol) {
      const validProtocols = ['search', 'rescue', 'surveillance'];
      return validProtocols.includes(protocol);
    }
  
    static isNonEmptyArray(arr) {
      return Array.isArray(arr) && arr.length > 0;
    }
  }
  
  module.exports = Validator;
  