const FLARESystem = require('./system/FLARESystem');
const ConfigManager = require('./utils/ConfigManager');
const ProtocolManager = require('./system/ProtocolManager');
const Logger = require('./utils/Logger');

(async () => {
  const inquirerModule = await import('inquirer');
  const open = await import('open');
  const inquirer = inquirerModule.default; 

  const initializeSystem = async () => {
    const config = ConfigManager.getConfig();
    const droneIDs = config.drones || [];
    if (droneIDs.length === 0) {
      Logger.log('No drones configured in the system. Please add drones.');
      return;
    }
    FLARESystem.initialize(droneIDs);
    Logger.log('System initialized with drones: ' + droneIDs.join(', '));
  };

  const addDrone = async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'droneID',
        message: 'Enter Drone ID to add:'
      }
    ]);
    const { droneID } = answers;
    FLARESystem.addDrone(droneID);
    Logger.log(`Drone ${droneID} added successfully.`);
  };

  const startSystem = () => {
    FLARESystem.start();
    FLARESystem.assignRoles();
    Logger.log('System started and roles assigned.');
  };

  const executeProtocol = async () => {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'protocol',
        message: 'Select protocol to execute:',
        choices: ['search', 'rescue', 'surveillance']
      }
    ]);
    const { protocol } = answers;
    ProtocolManager.executeProtocol(protocol, {});
    Logger.log(`Executing ${protocol} protocol.`);
  };

  const openMap = () => {
    open('https://www.google.com/maps');
    Logger.log('Google Maps opened for real-time location tracking.');
  };

  const mainMenu = async () => {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'command',
        message: 'Select a command to run:',
        choices: ['Initialize System', 'Add Drone', 'Start System', 'Execute Protocol', 'Open Map View', 'Exit']
      }
    ]);

    switch (answers.command) {
      case 'Initialize System':
        await initializeSystem();
        break;
      case 'Add Drone':
        await addDrone();
        break;
      case 'Start System':
        startSystem();
        break;
      case 'Execute Protocol':
        await executeProtocol();
        break;
      case 'Open Map View':
        openMap();
        break;
      case 'Exit':
        Logger.log('Exiting FLARE system.');
        process.exit();
    }

    await mainMenu();
  };

  mainMenu();
})();
