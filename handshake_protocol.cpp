#include "handshake_protocol.h"
#include <random>
#include <chrono>

HandshakeProtocol::HandshakeProtocol(SecurityManager* secManager) : securityManager(secManager) {}

HandshakeProtocol::~HandshakeProtocol() {}

void HandshakeProtocol::fft(CArray& x) {
    const size_t N = x.size();
    if (N <= 1) return;
    CArray even = x[std::slice(0, N/2, 2)];
    CArray odd = x[std::slice(1, N/2, 2)];
    fft(even);
    fft(odd);
    for (size_t k = 0; k < N/2; ++k) {
        Complex t = std::polar(1.0, -2 * M_PI * k / N) * odd[k];
        x[k] = even[k] + t;
        x[k+N/2] = even[k] - t;
    }
}

void HandshakeProtocol::ifft(CArray& x) {
    x = x.apply(std::conj);
    fft(x);
    x = x.apply(std::conj);
    x /= x.size();
}

void HandshakeProtocol::correlate(const CArray& a, const CArray& b, CArray& result) {
    size_t N = std::max(a.size(), b.size());
    CArray fa(N), fb(N);
    std::copy(std::begin(a), std::end(a), std::begin(fa));
    std::copy(std::begin(b), std::end(b), std::begin(fb));
    fft(fa);
    fft(fb);
    fb = fb.apply(std::conj);
    fa *= fb;
    ifft(fa);
    result = fa;
}

bool HandshakeProtocol::initiateHandshake(const std::string& droneID) {
    std::string token = generateHandshakeToken();
    std::string encryptedToken = securityManager->encrypt(token);
    if (encryptedToken.empty()) {
        return false;
    }

    if (!simulateNetworkSend(droneID, encryptedToken)) {
        return false;
    }

    return true;
}

bool HandshakeProtocol::respondToHandshake(const std::string& droneID, const std::string& token) {
    std::string decryptedToken = securityManager->decrypt(token);
    if (decryptedToken.empty()) {
        return false;
    }

    //validate the token structure or content
    if (!isValidToken(decryptedToken)) {
        return false;
    }

    return true;
}

std::string HandshakeProtocol::generateHandshakeToken() {
    auto now = std::chrono::high_resolution_clock::now();
    auto duration = now.time_since_epoch();
    auto microseconds = std::chrono::duration_cast<std::chrono::microseconds>(duration).count();
    std::string timeStr = std::to_string(microseconds);
    std::string randomBytes = securityManager->generateRandomBytes(16);
    return securityManager->encrypt(timeStr + randomBytes);
}

bool HandshakeProtocol::simulateNetworkSend(const std::string& droneID, const std::string& data) {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::bernoulli_distribution d(0.95); //95% chance of successful send

    return d(gen);
}

bool HandshakeProtocol::isValidToken(const std::string& token) {
    //example check: token must be at least 32 characters long, can be changed in future implementations
    return token.length() >= 32;
}
