#pragma once
#include <string>
#include <unordered_map>
#include <vector>
#include "BloomFilter.h"

class DroneRegistry {
private:
    std::unordered_map<std::string, std::string> droneMap;  // Maps drone IDs to details
    BloomFilter bloomFilter;

public:
    DroneRegistry();
    ~DroneRegistry();

    void registerDrone(const std::string& droneID, const std::string& droneDetails);
    void unregisterDrone(const std::string& droneID);
    bool isDroneRegistered(const std::string& droneID);
    std::string getDroneDetails(const std::string& droneID);
};

DroneRegistry::DroneRegistry() : bloomFilter(1024, 3) {}

DroneRegistry::~DroneRegistry() {}

void DroneRegistry::registerDrone(const std::string& droneID, const std::string& droneDetails) {
    if (!bloomFilter.mightContain(droneID)) {
        bloomFilter.add(droneID);
        droneMap[droneID] = droneDetails;
    }
}

void DroneRegistry::unregisterDrone(const std::string& droneID) {
    if (bloomFilter.mightContain(droneID) && droneMap.find(droneID) != droneMap.end()) {
        droneMap.erase(droneID);
        bloomFilter.remove(droneID);
    }
}

bool DroneRegistry::isDroneRegistered(const std::string& droneID) {
    return bloomFilter.mightContain(droneID) && droneMap.find(droneID) != droneMap.end();
}

std::string DroneRegistry::getDroneDetails(const std::string& droneID) {
    if (isDroneRegistered(droneID)) {
        return droneMap[droneID];
    }
    return "";
}
