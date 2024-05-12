#pragma once
#include <string>
#include <openssl/evp.h>
#include <openssl/ec.h>
#include <openssl/err.h>
#include <openssl/rand.h>
#include <memory>

class SecurityManager {
private:
    EVP_PKEY *pkey;
    EVP_CIPHER_CTX *encCtx;
    EVP_CIPHER_CTX *decCtx;

    void initContexts();
    void cleanup();

public:
    SecurityManager();
    ~SecurityManager();

    bool generateKeys();
    std::string publicKeyToPEM();
    bool loadPublicKeyFromPEM(const std::string &pubKeyPEM);

    std::string encrypt(const std::string &plaintext);
    std::string decrypt(const std::string &ciphertext);

    bool signMessage(const std::string &message, std::string &signature);
    bool verifySignature(const std::string &message, const std::string &signature);

    static std::string generateRandomBytes(size_t length);
};

SecurityManager::SecurityManager() : pkey(nullptr), encCtx(nullptr), decCtx(nullptr) {
    OpenSSL_add_all_algorithms();
    initContexts();
}

SecurityManager::~SecurityManager() {
    cleanup();
}

void SecurityManager::initContexts() {
    encCtx = EVP_CIPHER_CTX_new();
    decCtx = EVP_CIPHER_CTX_new();
    EVP_CIPHER_CTX_init(encCtx);
    EVP_CIPHER_CTX_init(decCtx);
}

void SecurityManager::cleanup() {
    if (encCtx) EVP_CIPHER_CTX_free(encCtx);
    if (decCtx) EVP_CIPHER_CTX_free(decCtx);
    if (pkey) EVP_PKEY_free(pkey);
}

bool SecurityManager::generateKeys() {
    EVP_PKEY_CTX *pctx = EVP_PKEY_CTX_new_id(EVP_PKEY_EC, NULL);
    EVP_PKEY_keygen_init(pctx);
    EVP_PKEY_CTX_set_ec_paramgen_curve_nid(pctx, NID_X9_62_prime256v1);
    EVP_PKEY_keygen(pctx, &pkey);
    EVP_PKEY_CTX_free(pctx);
    return pkey != nullptr;
}

std::string SecurityManager::publicKeyToPEM() {
    BIO *bio = BIO_new(BIO_s_mem());
    PEM_write_bio_PUBKEY(bio, pkey);
    char *data;
    long len = BIO_get_mem_data(bio, &data);
    std::string pem(data, len);
    BIO_free(bio);
    return pem;
}

bool SecurityManager::loadPublicKeyFromPEM(const std::string &pubKeyPEM) {
    BIO *bio = BIO_new_mem_buf(pubKeyPEM.data(), -1);
    PEM_read_bio_PUBKEY(bio, &pkey, NULL, NULL);
    BIO_free(bio);
    return pkey != nullptr;
}

std::string SecurityManager::encrypt(const std::string &plaintext) {
    std::vector<unsigned char> ciphertext(plaintext.size() + EVP_MAX_BLOCK_LENGTH);
    int len = 0, ciphertext_len = 0;

    if (!EVP_EncryptInit_ex(encCtx, EVP_aes_256_cbc(), NULL, EVP_PKEY_get0_EC_KEY(pkey), NULL)) {
        throw std::runtime_error("Failed to initialize encryption");
    }

    if (!EVP_EncryptUpdate(encCtx, ciphertext.data(), &len, reinterpret_cast<const unsigned char*>(plaintext.data()), plaintext.size())) {
        throw std::runtime_error("Failed to encrypt data");
    }
    ciphertext_len = len;

    if (!EVP_EncryptFinal_ex(encCtx, ciphertext.data() + len, &len)) {
        throw std::runtime_error("Failed to finalize encryption");
    }
    ciphertext_len += len;

    return std::string(reinterpret_cast<char*>(ciphertext.data()), ciphertext_len);
}

std::string SecurityManager::decrypt(const std::string &ciphertext) {
    std::vector<unsigned char> plaintext(ciphertext.size());
    int len = 0, plaintext_len = 0;

    if (!EVP_DecryptInit_ex(decCtx, EVP_aes_256_cbc(), NULL, EVP_PKEY_get0_EC_KEY(pkey), NULL)) {
        throw std::runtime_error("Failed to initialize decryption");
    }

    if (!EVP_DecryptUpdate(decCtx, plaintext.data(), &len, reinterpret_cast<const unsigned char*>(ciphertext.data()), ciphertext.size())) {
        throw std::runtime_error("Failed to decrypt data");
    }
    plaintext_len = len;

    if (!EVP_DecryptFinal_ex(decCtx, plaintext.data() + len, &len)) {
        throw std::runtime_error("Failed to finalize decryption");
    }
    plaintext_len += len;

    return std::string(reinterpret_cast<char*>(plaintext.data()), plaintext_len);
}

bool SecurityManager::signMessage(const std::string &message, std::string &signature) {
    EVP_MD_CTX* mdCtx = EVP_MD_CTX_new();
    if (!mdCtx) {
        throw std::runtime_error("Failed to create MD context for signing");
    }

    if (EVP_DigestSignInit(mdCtx, NULL, EVP_sha256(), NULL, pkey) <= 0) {
        EVP_MD_CTX_free(mdCtx);
        throw std::runtime_error("Failed to initialize digest sign");
    }

    size_t sig_len;
    if (EVP_DigestSign(mdCtx, NULL, &sig_len, reinterpret_cast<const unsigned char*>(message.data()), message.size()) <= 0) {
        EVP_MD_CTX_free(mdCtx);
        throw std::runtime_error("Failed to determine signature length");
    }

    std::vector<unsigned char> sig(sig_len);
    if (EVP_DigestSign(mdCtx, sig.data(), &sig_len, reinterpret_cast<const unsigned char*>(message.data()), message.size()) <= 0) {
        EVP_MD_CTX_free(mdCtx);
        throw std::runtime_error("Failed to sign message");
    }

    EVP_MD_CTX_free(mdCtx);
    signature.assign(reinterpret_cast<char*>(sig.data()), sig_len);
    return true;
}

bool SecurityManager::verifySignature(const std::string &message, const std::string &signature) {
    EVP_MD_CTX* mdCtx = EVP_MD_CTX_new();
    if (!mdCtx) {
        throw std::runtime_error("Failed to create MD context for verification");
    }

    if (EVP_DigestVerifyInit(mdCtx, NULL, EVP_sha256(), NULL, pkey) <= 0) {
        EVP_MD_CTX_free(mdCtx);
        throw std::runtime_error("Failed to initialize digest verify");
    }

    if (EVP_DigestVerify(mdCtx, reinterpret_cast<const unsigned char*>(signature.data()), signature.size(),
                         reinterpret_cast<const unsigned char*>(message.data()), message.size()) <= 0) {
        EVP_MD_CTX_free(mdCtx);
        throw std::runtime_error("Signature verification failed");
    }

    EVP_MD_CTX_free(mdCtx);
    return true;
}

std::string SecurityManager::generateRandomBytes(size_t length) {
    std::unique_ptr<unsigned char[]> buffer(new unsigned char[length]);
    RAND_bytes(buffer.get(), length);
    return std::string(reinterpret_cast<char*>(buffer.get()), length);
}
