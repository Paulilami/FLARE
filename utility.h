#pragma once
#include <chrono>
#include <cmath>
#include <string>

class Utility {
public:
    static long long currentTimeMillis();
    static double calculateSignalStrength(double distance);
    static std::string formatTimestamp(long long timestamp);
};

long long Utility::currentTimeMillis() {
    return std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::system_clock::now().time_since_epoch()
    ).count();
}

double Utility::calculateSignalStrength(double distance) {
    const double referenceDistance = 1.0; // meters
    const double pathLossExponent = 2.0; // Free space path loss exponent
    const double referenceSignalStrength = -30; // dBm at 1 meter

    if (distance < referenceDistance) {
        return referenceSignalStrength;
    }

    double signalStrength = referenceSignalStrength - 10 * pathLossExponent * log10(distance / referenceDistance);
    return signalStrength;
}

std::string Utility::formatTimestamp(long long timestamp) {
    std::time_t t = timestamp / 1000;
    char buffer[20];
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", std::localtime(&t));
    return std::string(buffer);
}
