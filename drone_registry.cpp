#include "drone_registry.h"

DroneRegistry::DroneRegistry() : bloomFilter(1024, 3) {}

DroneRegistry::~DroneRegistry() {}

void DroneRegistry::registerDrone(const std::string& droneID, const std::string& droneDetails) {
    if (!isDroneRegistered(droneID)) {
        bloomFilter.add(droneID);
        droneMap.insert({droneID, droneDetails});
    }
}

void DroneRegistry::unregisterDrone(const std::string& droneID) {
    if (isDroneRegistered(droneID)) {
        bloomFilter.remove(droneID);
        droneMap.erase(droneID);
    }
}

bool DroneRegistry::isDroneRegistered(const std::string& droneID) {
    return bloomFilter.mightContain(droneID) && droneMap.find(droneID) != droneMap.end();
}

std::string DroneRegistry::getDroneDetails(const std::string& droneID) {
    if (isDroneRegistered(droneID)) {
        return droneMap.at(droneID);
    }
    return "";
}
