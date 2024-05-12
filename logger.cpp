#include "logger.h"

std::unique_ptr<Logger> Logger::instance;

Logger::Logger() {
    logFile.open("default.log", std::ios::app);  
}

Logger::~Logger() {
    if (logFile.is_open()) {
        logFile.close();  
    }
}

Logger& Logger::getInstance() {
    std::lock_guard<std::mutex> lock(instance->writeMutex);
    if (instance == nullptr) {
        instance.reset(new Logger()); 
    }
    return *instance;
}

void Logger::log(const std::string& message, LogLevel level) {
    std::lock_guard<std::mutex> lock(writeMutex);
    if (logFile.is_open()) {
        const char* levelStr = nullptr;
        switch (level) {
            case LogLevel::Debug:    levelStr = "DEBUG"; break;
            case LogLevel::Info:     levelStr = "INFO"; break;
            case LogLevel::Warning:  levelStr = "WARNING"; break;
            case LogLevel::Error:    levelStr = "ERROR"; break;
        }
        logFile << "[" << levelStr << "] " << message << std::endl;  
    }
}

void Logger::setLogFile(const std::string& filename) {
    std::lock_guard<std::mutex> lock(writeMutex);
    if (logFile.is_open()) {
        logFile.close();  
    }
    logFile.open(filename, std::ios::app); 
}
