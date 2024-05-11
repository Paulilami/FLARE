#include "config.h"
#include "communication.h"
#include "network_manager.h"
#include "security_manager.h"
#include "handshake_protocol.h"
#include "authentication.h"
#include "drone_registry.h"
#include "message_format.h"
#include "utility.h"
#include "logger.h"
#include <memory>

int main() {
    Logger::initialize();
    Config::loadConfiguration();
    std::unique_ptr<NetworkManager> networkManager = std::make_unique<NetworkManager>();
    std::unique_ptr<SecurityManager> securityManager = std::make_unique<SecurityManager>();
    std::unique_ptr<Communication> communication = std::make_unique<Communication>(networkManager.get(), securityManager.get());
    std::unique_ptr<HandshakeProtocol> handshakeProtocol = std::make_unique<HandshakeProtocol>(securityManager.get());
    std::unique_ptr<Authentication> authentication = std::make_unique<Authentication>(securityManager.get());
    std::unique_ptr<DroneRegistry> droneRegistry = std::make_unique<DroneRegistry>();
    std::unique_ptr<MessageFormat> messageFormat = std::make_unique<MessageFormat>();
    std::unique_ptr<Utility> utility = std::make_unique<Utility>();

    networkManager->discoverDrones();
    handshakeProtocol->initiateProtocol();
    while (true) {
        communication->receiveMessages();
        communication->sendMessages();
        if (!utility->checkSystemHealth()) {
            Logger::logError("System health check failed.");
            break;
        }
    }
    return 0;
}
