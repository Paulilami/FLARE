#pragma once
#include <string>
#include <vector>

class DroneBrain {
public:
    void processEnvironmentData(const std::string& data);
    bool detectHandProximity(double handDistance);
    void analyzeEnvironment(const std::string& environmentType);
    void updateStateBasedOnEnvironment();
    void avoidHand();
    void simulateInsectMovement();
    void performTask(const std::string& task);

private:
    std::string currentEnvironment;
    bool avoidHandEnabled = false;
};
