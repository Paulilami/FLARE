#pragma once
#include <queue>
#include <mutex>
#include <condition_variable>
#include <thread>
#include "message_format.h"
#include "network_manager.h"
#include "security_manager.h"

class Communication {
private:
    NetworkManager* networkManager;
    SecurityManager* securityManager;
    std::queue<Message> incomingMessages;
    std::queue<Message> outgoingMessages;
    std::mutex mtx;
    std::condition_variable cv;
    bool stopSignal;
    std::thread receiverThread;
    std::thread senderThread;

    void receiveLoop();
    void sendLoop();

public:
    Communication(NetworkManager* netManager, SecurityManager* secManager);
    ~Communication();
    void sendMessages();
    void receiveMessages();
    void queueMessage(const Message& msg);
    void processIncomingMessage(const Message& msg);
    void stopCommunication();
};

void Communication::receiveLoop() {
    while (!stopSignal) {
        Message msg;
        if (networkManager->receive(msg)) {
            std::lock_guard<std::mutex> lock(mtx);
            incomingMessages.push(msg);
            cv.notify_one();
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
            // Handle send failure
        }
    }
}

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

void Communication::sendMessages() {
    // Called periodically to process and send messages
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
    // Processing logic for incoming messages
    // Might include decryption, verification, etc.
}

void Communication::stopCommunication() {
    stopSignal = true;
    cv.notify_all();
}
