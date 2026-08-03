package com.securevault.service;

import com.securevault.entity.Credential;
import com.securevault.repository.CredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialService {

    @Autowired
    private CredentialRepository credentialRepository;

    // Save Credential
    public Credential saveCredential(Credential credential) {
        return credentialRepository.save(credential);
    }

    // Get All Credentials
    public List<Credential> getAllCredentials() {
        return credentialRepository.findAll();
    }

    // Get Credential By ID
    public Credential getCredentialById(Long id) {
        return credentialRepository.findById(id).orElse(null);
    }

    // Update Credential
    public Credential updateCredential(Long id, Credential credential) {

        Credential existing = credentialRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setWebsite(credential.getWebsite());
            existing.setUsername(credential.getUsername());
            existing.setPassword(credential.getPassword());

            return credentialRepository.save(existing);
        }

        return null;
    }
}