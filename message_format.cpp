#include "message_format.h"

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
