#pragma once
#include <string>
#include <unordered_map>

class Config {
private:
    static std::unordered_map<std::string, std::string> configMap;

public:
    static void loadConfiguration() {
        configMap["MessageSize"] = "1024";
        configMap["MaxFrequency"] = "100";
        configMap["MinFrequency"] = "10";
        configMap["EncryptionKey"] = "base64:AesPskKey123=";
        configMap["EncryptionType"] = "AES-128";
        configMap["HMACKey"] = "base64:HmacKey123=";
        configMap["ECCCurve"] = "secp256r1";
        configMap["FFTWindowSize"] = "256";
        configMap["BloomFilterSize"] = "512";
        configMap["BloomFilterHashFunctions"] = "3";
    }

    static std::string get(const std::string& key) {
        auto it = configMap.find(key);
        if (it != configMap.end()) {
            return it->second;
        }
        return "";
    }

    static void set(const std::string& key, const std::string& value) {
        configMap[key] = value;
    }
};

std::unordered_map<std::string, std::string> Config::configMap;
