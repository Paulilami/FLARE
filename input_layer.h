#pragma once
#include "communication.h"
#include "network_manager.h"
#include "drone_registry.h"
#include <vector>
#include <string>
#include <functional>
#include <map>
#include <sstream>
#include <stdexcept>
#include <cmath>

class InputLayer {
private:
    NetworkManager* networkManager;
    Communication* communication;
    DroneRegistry* droneRegistry;

    // Define a command function type that handles complex input sequences
    using CommandFunction = std::function<void(const std::vector<std::string>&)>;
    std::map<std::string, CommandFunction> commandHandlers;

    void registerCommands();
    std::vector<std::string> parseArguments(const std::string& commandArgs);

public:
    InputLayer(NetworkManager* nm, Communication* com, DroneRegistry* dr);
    ~InputLayer();

    void dispatchCommand(const std::string& commandLine);
    void executeCommand(const std::string& command, const std::vector<std::string>& args);
    void onCommandReceived(const std::string& commandLine);

    // Command handlers
    void handleFlyTo(const std::vector<std::string>& args);
    void handleComeHome(const std::vector<std::string>& args);
    void handleFormation(const std::vector<std::string>& args);
    void handleStatusCheck(const std::vector<std::string>& args);
};

InputLayer::InputLayer(NetworkManager* nm, Communication* com, DroneRegistry* dr) :
    networkManager(nm), communication(com), droneRegistry(dr) {
    registerCommands();
}

InputLayer::~InputLayer() {}

void InputLayer::registerCommands() {
    commandHandlers["fly_to"] = std::bind(&InputLayer::handleFlyTo, this, std::placeholders::_1);
    commandHandlers["come_home"] = std::bind(&InputLayer::handleComeHome, this, std::placeholders::_1);
    commandHandlers["formation"] = std::bind(&InputLayer::handleFormation, this, std::placeholders::_1);
    commandHandlers["status"] = std::bind(&InputLayer::handleStatusCheck, this, std::placeholders::_1);
}

std::vector<std::string> InputLayer::parseArguments(const std::string& commandArgs) {
    std::istringstream iss(commandArgs);
    std::vector<std::string> args;
    std::string arg;
    while (std::getline(iss, arg, ',')) {
        args.push_back(arg);
    }
    return args;
}

void InputLayer::dispatchCommand(const std::string& commandLine) {
    auto args = parseArguments(commandLine);
    if (args.empty()) return;
    auto command = args.front();
    args.erase(args.begin());
    if (commandHandlers.find(command) != commandHandlers.end()) {
        executeCommand(command, args);
    }
}

void InputLayer::executeCommand(const std::string& command, const std::vector<std::string>& args) {
    try {
        commandHandlers[command](args);
    } catch (const std::exception& e) {
        std::cerr << "Error executing command '" << command << "': " << e.what() << std::endl;
    }
}

void InputLayer::onCommandReceived(const std::string& commandLine) {
    dispatchCommand(commandLine);
}

void InputLayer::handleFlyTo(const std::vector<std::string>& args) {
    if (args.size() < 2) throw std::invalid_argument("Insufficient arguments for fly_to command.");
    double latitude = std::stod(args[0]);
    double longitude = std::stod(args[1]);
    std::string message = "MoveTo|" + std::to_string(latitude) + "|" + std::to_string(longitude);
    auto drones = droneRegistry->getActiveDrones();
    for (auto& drone : drones) {
        communication->sendMessage(drone.id, message);
    }
}

void InputLayer::handleComeHome(const std::vector<std::string>& args) {
    std::string message = "ReturnHome";
    auto drones = droneRegistry->getActiveDrones();
    for (auto& drone : drones) {
        communication->sendMessage(drone.id, message);
    }
}

void InputLayer::handleFormation(const std::vector<std::string>& args) {
    if (args.size() < 1) throw std::invalid_argument("No formation type specified.");
    std::string formationType = args[0];
    std::string message = "Formation|" + formationType;
    auto drones = droneRegistry->getActiveDrones();
    for (auto& drone : drones) {
        communication->sendMessage(drone.id, message);
    }
}

void InputLayer::handleDeterAnimalPresence(const std::vector<std::string>& args) {
    if (args.size() < 3) throw std::invalid_argument("Insufficient arguments for deterrence command. Required: latitude, longitude, deterrence type.");

    double latitude = std::stod(args[0]);
    double longitude = std::stod(args[1]);
    std::string deterrenceType = args[2];  // "noise" or "light" to safely deter animals without harm

    std::string message = "DeterAnimal|" + std::to_string(latitude) + "|" + std::to_string(longitude) + "|" + deterrenceType;
    auto drones = droneRegistry->getActiveDrones();
    for (auto& drone : drones) {
        // Sending command to drones
        communication->sendMessage(drone.id, message);
    }
}

void InputLayer::handleStatusCheck(const std::vector<std::string>& args) {
    std::string message = "StatusCheck";
    auto drones = droneRegistry->getActiveDrones();
    for (auto& drone : drones) {
        communication->sendMessage(drone.id, message);
    }
}
