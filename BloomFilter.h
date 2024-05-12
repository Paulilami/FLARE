#include <vector>
#include <array>
#include <cmath>
#include <algorithm>
#include <functional>

class BloomFilter {
private:
    std::vector<int> bitCounts;  
    size_t hashCount;

    std::hash<std::string> hash_fn;

    std::array<size_t, 2> hash(const std::string &item, int i) const {
        size_t hash1 = hash_fn(item);
        size_t hash2 = std::hash<size_t>{}(hash1 + i);
        return {hash1 % bitCounts.size(), hash2 % bitCounts.size()};
    }

public:
    BloomFilter(size_t size, size_t numHashes);
    void add(const std::string &item);
    bool mightContain(const std::string &item) const;
    void remove(const std::string &item);

    double estimatedFalsePositiveRate(size_t insertedElements) const {
        double rate = std::pow(1 - exp(-hashCount * double(insertedElements) / bitCounts.size()), double(hashCount));
        return rate;
    }
};

BloomFilter::BloomFilter(size_t size, size_t numHashes) : bitCounts(size), hashCount(numHashes) {}

void BloomFilter::add(const std::string &item) {
    for (size_t i = 0; i < hashCount; ++i) {
        auto hashes = hash(item, i);
        bitCounts[hashes[0]]++;
        bitCounts[hashes[1]]++;
    }
}

bool BloomFilter::mightContain(const std::string &item) const {
    for (size_t i = 0; i < hashCount; ++i) {
        auto hashes = hash(item, i);
        if (bitCounts[hashes[0]] == 0 || bitCounts[hashes[1]] == 0) return false;
    }
    return true;
}

void BloomFilter::remove(const std::string &item) {
    for (size_t i = 0; i < hashCount; ++i) {
        auto hashes = hash(item, i);
        if (bitCounts[hashes[0]] > 0) bitCounts[hashes[0]]--;
        if (bitCounts[hashes[1]] > 0) bitCounts[hashes[1]]--;
    }
}

