#pragma once
#include <string>
#include "security_manager.h"

class Authentication {
private:
    SecurityManager* securityManager;

public:
    Authentication(SecurityManager* secManager);
    ~Authentication();

    bool verifyCredentials(const std::string& droneID, const std::string& credentials);
    std::string generateCredentials(const std::string& droneID);
    bool checkSignature(const std::string& message, const std::string& signature);
    std::string signMessage(const std::string& message);
};

Authentication::Authentication(SecurityManager* secManager) : securityManager(secManager) {}

Authentication::~Authentication() {}

bool Authentication::verifyCredentials(const std::string& droneID, const std::string& credentials) {
    return securityManager->verifySignature(droneID, credentials);
}

std::string Authentication::generateCredentials(const std::string& droneID) {
    std::string credentials = "Credentials for " + droneID;
    return securityManager->signMessage(credentials);
}

bool Authentication::checkSignature(const std::string& message, const std::string& signature) {
    return securityManager->verifySignature(message, signature);
}

std::string Authentication::signMessage(const std::string& message) {
    std::string signature;
    securityManager->signMessage(message, signature);
    return signature;
}
