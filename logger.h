#pragma once
#include <string>
#include <fstream>
#include <mutex>
#include <memory>

enum class LogLevel {
    Debug,
    Info,
    Warning,
    Error
};

class Logger {
private:
    static std::unique_ptr<Logger> instance;
    std::ofstream logFile;
    std::mutex writeMutex;

    Logger();

public:
    ~Logger();
    static Logger& getInstance();
    void log(const std::string& message, LogLevel level);
    void setLogFile(const std::string& filename);
};

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
    if (!instance) {
        instance = std::unique_ptr<Logger>(new Logger());
    }
    return *instance;
}

void Logger::log(const std::string& message, LogLevel level) {
    std::lock_guard<std::mutex> lock(writeMutex);
    if (!logFile.is_open()) {
        return;
    }
    logFile << "[" << std::to_string(static_cast<int>(level)) << "] " << message << std::endl;
}

void Logger::setLogFile(const std::string& filename) {
    std::lock_guard<std::mutex> lock(writeMutex);
    if (logFile.is_open()) {
        logFile.close();
    }
    logFile.open(filename, std::ios::app);
}
