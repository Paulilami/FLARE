#pragma once
#include <string>
#include <vector>
#include <cstring>
#include <sstream>

class MessageFormat {
public:
    struct Message {
        int type;
        std::string sourceID;
        std::string targetID;
        std::string payload;
    };

    static std::string serialize(const Message& message);
    static Message deserialize(const std::string& data);

};

std::string MessageFormat::serialize(const Message& message) {
    std::ostringstream stream;
    stream << message.type << "|" << message.sourceID << "|" << message.targetID << "|" << message.payload;
    return stream.str();
}

MessageFormat::Message MessageFormat::deserialize(const std::string& data) {
    std::istringstream stream(data);
    Message message;
    std::string segment;
    std::getline(stream, segment, '|');
    message.type = std::stoi(segment);
    std::getline(stream, message.sourceID, '|');
    std::getline(stream, message.targetID, '|');
    std::getline(stream, message.payload, '|');
    return message;
}
