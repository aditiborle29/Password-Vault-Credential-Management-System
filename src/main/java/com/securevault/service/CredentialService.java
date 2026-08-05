package com.securevault.service;

import com.securevault.entity.Credential;
import com.securevault.entity.User;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.UserRepository;
import com.securevault.util.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialService {

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private UserRepository userRepository;

    // ================= SAVE CREDENTIAL =================

    public Credential saveCredential(Credential credential) {

        User user = userRepository
                .findByEmail(credential.getEmail())
                .orElse(null);

        if (user == null) {
            return null;
        }

        credential.setUser(user);

        credential.setPassword(
                AESUtil.encrypt(credential.getPassword()));

        return credentialRepository.save(credential);
    }

    // ================= GET USER CREDENTIALS =================

    public List<Credential> getAllCredentials(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return List.of();
        }

        List<Credential> credentials = credentialRepository.findByUser(user);

        for (Credential credential : credentials) {
            credential.setPassword(
                    AESUtil.decrypt(credential.getPassword()));
        }

        return credentials;
    }

    // ================= GET CREDENTIAL BY ID =================

    public Credential getCredentialById(Long id) {

        Credential credential = credentialRepository.findById(id).orElse(null);

        if (credential != null) {
            credential.setPassword(
                    AESUtil.decrypt(credential.getPassword()));
        }

        return credential;
    }

    // ================= UPDATE CREDENTIAL =================

    public Credential updateCredential(Long id, Credential credential) {

        Credential existing = credentialRepository.findById(id).orElse(null);

        if (existing != null) {

            existing.setWebsite(credential.getWebsite());
            existing.setUsername(credential.getUsername());

            existing.setPassword(
                    AESUtil.encrypt(credential.getPassword()));

            return credentialRepository.save(existing);
        }

        return null;
    }

    // ================= DELETE =================

    public void deleteCredential(Long id) {
        credentialRepository.deleteById(id);
    }
}