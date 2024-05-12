#include "authentication.h"

Authentication::Authentication(SecurityManager* secManager) : securityManager(secManager) {}

Authentication::~Authentication() {}

bool Authentication::verifyCredentials(const std::string& droneID, const std::string& credentials) {
    std::string message = "Authenticate: " + droneID;
    return securityManager->verifySignature(message, credentials);
}

std::string Authentication::generateCredentials(const std::string& droneID) {
    std::string message = "Credentials for " + droneID + ": " + std::to_string(std::hash<std::string>{}(droneID));
    std::string signature;
    securityManager->signMessage(message, signature);
    return signature;
}

bool Authentication::checkSignature(const std::string& message, const std::string& signature) {
    return securityManager->verifySignature(message, signature);
}

std::string Authentication::signMessage(const std::string& message) {
    std::string signature;
    securityManager->signMessage(message, signature);
    return signature;
}
