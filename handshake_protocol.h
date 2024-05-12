#pragma once
#include <vector>
#include <complex>
#include <valarray>
#include "security_manager.cpp"

typedef std::complex<double> Complex;
typedef std::valarray<Complex> CArray;

class HandshakeProtocol {
private:
    SecurityManager* securityManager;

    void fft(CArray& x);
    void ifft(CArray& x);
    void correlate(const CArray& a, const CArray& b, CArray& result);

public:
    HandshakeProtocol(SecurityManager* secManager);
    ~HandshakeProtocol();

    bool initiateHandshake(const std::string& droneID);
    bool respondToHandshake(const std::string& droneID, const std::string& token);
    std::string generateHandshakeToken();
};

HandshakeProtocol::HandshakeProtocol(SecurityManager* secManager) : securityManager(secManager) {}

HandshakeProtocol::~HandshakeProtocol() {}

void HandshakeProtocol::fft(CArray& x) {
    const size_t N = x.size();
    if (N <= 1) return;

    CArray even = x[std::slice(0, N/2, 2)];
    CArray  odd = x[std::slice(1, N/2, 2)];

    fft(even);
    fft(odd);

    for (size_t k = 0; k < N/2; ++k) {
        Complex t = std::polar(1.0, -2 * M_PI * k / N) * odd[k];
        x[k]     = even[k] + t;
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
    CArray fa(a.size());
    CArray fb(b.size());
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
    // Send token to drone for synchronization
    return securityManager->encrypt(token).empty() == false;
}

bool HandshakeProtocol::respondToHandshake(const std::string& droneID, const std::string& token) {
    // Validate and respond to handshake token received from another drone
    return securityManager->decrypt(token).empty() == false;
}

std::string HandshakeProtocol::generateHandshakeToken() {
    return securityManager->generateRandomBytes(16);  // Generate a 16-byte token for handshake
}
