#include "utility.h"
#include <ctime>
#include <iomanip>
#include <sstream>

long long Utility::currentTimeMillis() {
    auto now = std::chrono::system_clock::now();
    auto since_epoch = now.time_since_epoch();
    return std::chrono::duration_cast<std::chrono::milliseconds>(since_epoch).count();
}

double Utility::calculateSignalStrength(double distance) {
    const double referenceDistance = 1.0; // meters
    const double pathLossExponent = 2.8; // Free space path loss exponent for urban environments
    const double referenceSignalStrength = -40; // dBm at 1 meter

    if (distance <= 0) distance = 0.1; // Preventing division by zero or log of zero
    return referenceSignalStrength - (10 * pathLossExponent * log10(distance / referenceDistance));
}

std::string Utility::formatTimestamp(long long timestamp) {
    std::time_t raw_time = timestamp / 1000;
    struct tm *dt;
    char buffer[30];
    dt = localtime(&raw_time);
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", dt);
    return std::string(buffer);
}
