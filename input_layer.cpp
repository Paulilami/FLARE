#include "input_layer.h"
#include "logger.h"

InputLayer::InputLayer(NetworkManager* nm, Communication* com, DroneRegistry* dr) :
    networkManager(nm), communication(com), droneRegistry(dr) {
    registerCommands();
}

InputLayer::~InputLayer() {}

void InputLayer::registerCommands() {
    commandHandlers["fly_to"] = std::bind(&InputLayer::handleFlyTo, this, std::placeholders::_1);
    commandHandlers["come_home"] = std::bind(&InputLayer::handleComeHome, this, std::placeholders::_1);
    commandHandlers["formation"] = std::bind(&InputLayer::handleFormation, this, std::placeholders::_1);
    commandHandlers["status_check"] = std::bind(&InputLayer::handleStatusCheck, this, std::placeholders::_1);
    commandHandlers["deter_animal_presence"] = std::bind(&InputLayer::handleDeterAnimalPresence, this, std::placeholders::_1);
}

void InputLayer::dispatchCommand(const std::string& commandLine) {
    std::istringstream stream(commandLine);
    std::string command;
    std::getline(stream, command, '|');
    std::vector<std::string> args;
    std::string arg;
    while (std::getline(stream, arg, '|')) {
        args.push_back(arg);
    }

    if (commandHandlers.find(command) != commandHandlers.end()) {
        commandHandlers[command](args);
    } else {
        Logger::getInstance().log("Received unknown command: " + command, LogLevel::Warning);
    }
}

void InputLayer::executeCommand(const std::string& command, const std::vector<std::string>& args) {
    try {
        if (commandHandlers.find(command) != commandHandlers.end()) {
            commandHandlers[command](args);
        } else {
            throw std::runtime_error("Command not registered: " + command);
        }
    } catch (const std::exception& e) {
        Logger::getInstance().log("Error executing command: " + std::string(e.what()), LogLevel::Error);
    }
}

void InputLayer::onCommandReceived(const std::string& commandLine) {
    dispatchCommand(commandLine);
}

void InputLayer::handleFlyTo(const std::vector<std::string>& args) {
    if (args.size() < 2) throw std::invalid_argument("handleFlyTo requires latitude and longitude.");
    double latitude = std::stod(args[0]);
    double longitude = std::stod(args[1]);
    std::string message = "Command|FlyTo|" + std::to_string(latitude) + "|" + std::to_string(longitude);
    communication->broadcastMessage(message);
}

void InputLayer::handleComeHome(const std::vector<std::string>& args) {
    std::string message = "Command|ComeHome";
    communication->broadcastMessage(message);
}

void InputLayer::handleFormation(const std::vector<std::string>& args) {
    if (args.size() < 1) throw std::invalid_argument("handleFormation requires a formation type.");
    std::string formationType = args[0];
    std::string message = "Command|Formation|" + formationType;
    communication->broadcastMessage(message);
}

void InputLayer::handleStatusCheck(const std::vector<std::string>& args) {
    std::string message = "Command|StatusCheck";
    communication->broadcastMessage(message);
}

void InputLayer::handleDeterAnimalPresence(const std::vector<std::string>& args) {
    if (args.size() < 3) throw std::invalid_argument("handleDeterAnimalPresence requires latitude, longitude, and method.");
    double latitude = std::stod(args[0]);
    double longitude = std::stod(args[1]);
    std::string method = args[2];
    std::string message = "Command|DeterAnimal|" + std::to_string(latitude) + "|" + std::to_string(longitude) + "|" + method;
    communication->broadcastMessage(message);
}
