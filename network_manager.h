#pragma once
#include <vector>
#include <map>
#include <string>
#include "drone_registry.h"
#include "utility.h"
#include "logger.h"
#include <mutex>

class NetworkManager {
private:
    std::map<std::string, DroneInfo> activeDrones; 
    std::mutex networkMutex;  // Mutex to protect access to the activeDrones map
    int maxRange;
    bool autoDiscoveryEnabled; 

    void scanForDrones();

public:
    NetworkManager(int range = 200, bool autoDiscovery = true);

    ~NetworkManager();

    void startDiscovery();

    void stopDiscovery();

    bool send(const std::string& droneID, const Message& message);

    bool receive(Message& message);

    void addDrone(const DroneInfo& drone);

    void removeDrone(const std::string& droneID);

    std::vector<DroneInfo> getActiveDrones() const;

    bool checkConnectivity(const std::string& droneID);
};

