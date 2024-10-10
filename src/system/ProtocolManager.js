const SearchProtocol = require('../protocols/SearchProtocol');
const RescueProtocol = require('../protocols/RescueProtocol');
const SurveillanceProtocol = require('../protocols/SurveillanceProtocol');
const Logger = require('../utils/Logger');

class ProtocolManager {
  static executeProtocol(protocol, context) {
    switch (protocol) {
      case 'search':
        SearchProtocol.run(context);
        Logger.log('Search Protocol executed.');
        break;
      case 'rescue':
        RescueProtocol.run(context);
        Logger.log('Rescue Protocol executed.');
        break;
      case 'surveillance':
        SurveillanceProtocol.run(context);
        Logger.log('Surveillance Protocol executed.');
        break;
      default:
        Logger.error(`Protocol "${protocol}" not recognized.`);
    }
  }

  static configureProtocol(protocol, settings) {
    switch (protocol) {
      case 'search':
        SearchProtocol.configure(settings);
        Logger.log('Search Protocol configured.');
        break;
      case 'rescue':
        RescueProtocol.configure(settings);
        Logger.log('Rescue Protocol configured.');
        break;
      case 'surveillance':
        SurveillanceProtocol.configure(settings);
        Logger.log('Surveillance Protocol configured.');
        break;
      default:
        Logger.error(`Protocol "${protocol}" configuration not recognized.`);
    }
  }
}

module.exports = ProtocolManager;
