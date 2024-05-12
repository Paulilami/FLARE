#include "network_manager.h"
#include "config.h"
#include "logger.h"

NetworkManager::NetworkManager(int range, bool autoDiscovery) : maxRange(range), autoDiscoveryEnabled(autoDiscovery) {
    if (autoDiscoveryEnabled) {
        startDiscovery();
    }
}

NetworkManager::~NetworkManager() {
    stopDiscovery();
}

void NetworkManager::startDiscovery() {
    Logger::log("Starting network discovery.", LogLevel::Info);
    if (!discoveryThread || !discoveryThread->joinable()) {
        stopSignal = false; // Reset stop signal for a new discovery session
        discoveryThread = std::make_unique<std::thread>(&NetworkManager::discoveryLoop, this);
        Logger::log("Network discovery thread launched.", LogLevel::Debug);
    } else {
        Logger::log("Network discovery already in progress.", LogLevel::Warning);
    }
}

void NetworkManager::stopDiscovery() {
    Logger::log("Stopping network discovery.", LogLevel::Info);
    if (discoveryThread && discoveryThread->joinable()) {
        stopSignal = true; /
        discoveryThread->join(); // Wait for the thread to finish
        Logger::log("Network discovery thread stopped.", LogLevel::Debug);
    } else {
        Logger::log("No network discovery thread to stop.", LogLevel::Warning);
    }
}

void NetworkManager::discoveryLoop() {
    Logger::log("Discovery loop initiated.", LogLevel::Debug);
    while (!stopSignal) {
        scanForDrones();
        std::this_thread::sleep_for(std::chrono::seconds(5)); // Scan every 5 seconds
        Logger::log("Rescanning for new drones.", LogLevel::Debug);
    }
    Logger::log("Exiting discovery loop.", LogLevel::Info);
}


void NetworkManager::scanForDrones() {
    Logger::log("Scanning for nearby drones...", LogLevel::Debug);
    std::vector<std::string> discoveredIPs = networkInterface.scanNetworkForDrones(maxRange);
    for (const auto& ip : discoveredIPs) {
        Message handshakeMessage;
        if (send(ip, handshakeMessage)) {
            DroneInfo newDrone;
            newDrone.infoID = generateDroneID(ip);
            newDrone.ipAddress = ip;
            addDrone(newDrone);
            Logger::log("Drone discovered and added: " + newDrone.infoID, LogLevel::Info);
        }
    }
}

bool NetworkManager::send(const std::string& droneID, const Message& message) {
    Logger::log("Sending message to drone ID: " + droneID, LogLevel::Debug);
    // Integration with communication hardware or software stack
    try {
        if (communicationHardware.sendData(activeDrones[droneID].ipAddress, message.serialize())) {
            Logger::log("Message sent successfully to: " + droneID, LogLevel::Info);
            return true;
        } else {
            Logger::log("Failed to send message to: " + droneID, LogLevel::Error);
            return false;
        }
    } catch (const std::exception& e) {
        Logger::log("Exception in sending message: " + std::string(e.what()), LogLevel::Error);
        return false;
    }
}

bool NetworkManager::receive(Message& message) {
    Logger::log("Attempting to receive message.", LogLevel::Debug);
    std::string data;
    if (communicationHardware.receiveData(data)) {
        if (message.deserialize(data)) {
            Logger::log("Message received and deserialized successfully.", LogLevel::Info);
            return true;
        } else {
            Logger::log("Failed to deserialize received data.", LogLevel::Error);
        }
    } else {
        Logger::log("No data received.", LogLevel::Warning);
    }
    return false;
}


void NetworkManager::addDrone(const DroneInfo& drone) {
    std::lock_guard<std::mutex> lock(networkMutex);
    activeDrones[drone.infoID] = drone;
    Logger::log("Drone added to network: " + drone.infoID, LogLevel::Info);
}

void NetworkManager::removeDrone(const std::string& droneID) {
    std::lock_guard<std::mutex> lock(networkMutex);
    if (activeDrones.erase(droneID)) {
        Logger::log("Drone removed from network: " + droneID, LogLevel::Info);
    }
}

std::vector<DroneInfo> NetworkManager::getActiveDrones() const {
    std::lock_guard<std::mutex> lock(networkMutex);
    std::vector<DroneInfo> drones;
    for (const auto& pair : activeDrones) {
        drones.push_back(pair.second);
    }
    return drones;
}

bool NetworkManager::checkConnectivity(const std::string& droneID) {
    Logger::log("Checking connectivity with drone: " + droneID, LogLevel::Debug);
    if (activeDrones.find(droneID) == activeDrones.end()) {
        Logger::log("Drone not found in the active list: " + droneID, LogLevel::Warning);
        return false;
    }

    // Send a heartbeat message to verify responsiveness
    Message heartbeatMsg;
    heartbeatMsg.type = MessageType::Heartbeat;
    heartbeatMsg.content = "Ping";
    auto startTime = std::chrono::high_resolution_clock::now();

    if (!send(droneID, heartbeatMsg)) {
        Logger::log("Failed to send heartbeat to drone: " + droneID, LogLevel::Error);
        return false;
    }

    // Wait for a heartbeat response 
    Message responseMsg;
    if (!receive(responseMsg, 5)) { // Timeout after 5 seconds
        Logger::log("No response received from drone: " + droneID, LogLevel::Error);
        return false;
    }

    auto endTime = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime).count();

    if (responseMsg.type == MessageType::Heartbeat && responseMsg.content == "Pong") {
        Logger::log("Connectivity with drone verified: " + droneID + " (Latency: " + std::to_string(duration) + " ms)", LogLevel::Info);
        return true;
    } else {
        Logger::log("Unexpected response type or content from drone: " + droneID, LogLevel::Error);
        return false;
    }
}

bool NetworkManager::receive(Message& message, int timeoutSeconds) {
    auto endTime = std::chrono::steady_clock::now() + std::chrono::seconds(timeoutSeconds);
    while (std::chrono::steady_clock::now() < endTime) {
        if (communicationHardware.receiveData(message)) {
            return true;
        }
    }
    return false;
}
