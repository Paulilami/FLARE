#include "communication.h"
#include "logger.h"

Communication::Communication(NetworkManager* netManager, SecurityManager* secManager) :
    networkManager(netManager), securityManager(secManager), stopSignal(false) {
    receiverThread = std::thread(&Communication::receiveLoop, this);
    senderThread = std::thread(&Communication::sendLoop, this);
}

Communication::~Communication() {
    stopSignal = true;
    cv.notify_all();
    if (receiverThread.joinable()) receiverThread.join();
    if (senderThread.joinable()) senderThread.join();
}

void Communication::receiveLoop() {
    while (!stopSignal) {
        Message msg;
        if (networkManager->receive(msg)) {
            std::lock_guard<std::mutex> lock(mtx);
            incomingMessages.push(msg);
            cv.notify_one();
            Logger::log("Message received and queued for processing.", LogLevel::Debug);
        }
    }
}

void Communication::sendLoop() {
    while (!stopSignal) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this] { return !outgoingMessages.empty() || stopSignal; });
        if (stopSignal) break;
        Message msg = outgoingMessages.front();
        outgoingMessages.pop();
        lock.unlock();
        if (!networkManager->send(msg)) {
            Logger::log("Failed to send message.", LogLevel::Error);
        }
        else {
            Logger::log("Message sent successfully.", LogLevel::Info);
        }
    }
}

void Communication::sendMessages() {
    Message msg;
    while (getMessageToSend(msg)) {
        queueMessage(msg);
    }
}

void Communication::receiveMessages() {
    std::lock_guard<std::mutex> lock(mtx);
    while (!incomingMessages.empty()) {
        Message msg = incomingMessages.front();
        incomingMessages.pop();
        processIncomingMessage(msg);
    }
}

void Communication::queueMessage(const Message& msg) {
    std::lock_guard<std::mutex> lock(mtx);
    outgoingMessages.push(msg);
    cv.notify_one();
}

void Communication::processIncomingMessage(const Message& msg) {
    if (securityManager->verifyMessage(msg)) {
        Logger::log("Message verified and ready for further processing.", LogLevel::Debug);
        //...
    } else {
        Logger::log("Message verification failed.", LogLevel::Warning);
    }
}

void Communication::stopCommunication() {
    stopSignal = true;
    cv.notify_all();
}

bool Communication::getMessageToSend(Message& msg) {
    //...
    return false; //simulate 
}
