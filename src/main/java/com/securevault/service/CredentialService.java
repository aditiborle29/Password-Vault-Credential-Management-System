package com.securevault.service;

import com.securevault.dto.SharedCredentialResponse;
import com.securevault.entity.Credential;
import com.securevault.entity.SharedCredential;
import com.securevault.entity.User;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.SharedCredentialRepository;
import com.securevault.repository.UserRepository;
import com.securevault.util.AESUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CredentialService {

        @Autowired
        private CredentialRepository credentialRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private SharedCredentialRepository sharedCredentialRepository;

        // =====================================================
        // SAVE CREDENTIAL
        // =====================================================

        public Credential saveCredential(Credential credential) {

                User user = userRepository
                                .findByEmail(credential.getEmail())
                                .orElse(null);

                if (user == null) {
                        return null;
                }

                credential.setUser(user);

                // Encrypt password before saving
                credential.setPassword(
                                AESUtil.encrypt(credential.getPassword()));

                return credentialRepository.save(credential);
        }

        // =====================================================
        // GET MY CREDENTIALS
        // =====================================================

        public List<Credential> getAllCredentials(String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElse(null);

                if (user == null) {
                        return List.of();
                }

                List<Credential> credentials = credentialRepository.findByUser(user);

                // Decrypt passwords before sending to frontend
                for (Credential credential : credentials) {

                        credential.setPassword(
                                        AESUtil.decrypt(
                                                        credential.getPassword()));
                }

                return credentials;
        }

        // =====================================================
        // GET SHARED CREDENTIALS
        // =====================================================

        public List<SharedCredentialResponse> getSharedCredentials(
                        String email) {

                // Find the user who is logged in
                User user = userRepository
                                .findByEmail(email)
                                .orElse(null);

                // User does not exist
                if (user == null) {
                        return List.of();
                }

                // Find credentials shared WITH this user
                List<SharedCredential> sharedCredentials = sharedCredentialRepository
                                .findBySharedWith(user);

                List<SharedCredentialResponse> responseList = new ArrayList<>();

                for (SharedCredential shared : sharedCredentials) {

                        Credential credential = shared.getCredential();

                        if (credential == null) {
                                continue;
                        }

                        // Create response object
                        SharedCredentialResponse response = new SharedCredentialResponse();

                        response.setId(credential.getId());

                        response.setWebsite(
                                        credential.getWebsite());

                        response.setUsername(
                                        credential.getUsername());

                        // Decrypt password
                        response.setPassword(
                                        AESUtil.decrypt(
                                                        credential.getPassword()));

                        responseList.add(response);
                }

                return responseList;
        }

        // =====================================================
        // GET CREDENTIAL BY ID
        // =====================================================

        public Credential getCredentialById(Long id) {

                Credential credential = credentialRepository
                                .findById(id)
                                .orElse(null);

                if (credential != null) {

                        credential.setPassword(
                                        AESUtil.decrypt(
                                                        credential.getPassword()));
                }

                return credential;
        }

        // =====================================================
        // UPDATE CREDENTIAL
        // =====================================================

        public Credential updateCredential(
                        Long id,
                        Credential credential,
                        String email) {

                Credential existing = credentialRepository
                                .findById(id)
                                .orElse(null);

                if (existing == null) {
                        return null;
                }

                User user = userRepository
                                .findByEmail(email)
                                .orElse(null);

                if (user == null) {
                        return null;
                }

                // =================================================
                // OWNER CAN EDIT
                // =================================================

                if (existing.getUser() != null &&
                                existing.getUser()
                                                .getId()
                                                .equals(user.getId())) {

                        existing.setWebsite(
                                        credential.getWebsite());

                        existing.setUsername(
                                        credential.getUsername());

                        existing.setPassword(
                                        AESUtil.encrypt(
                                                        credential.getPassword()));

                        return credentialRepository.save(existing);
                }

                // =================================================
                // CHECK SHARED PERMISSION
                // =================================================

                SharedCredential shared = sharedCredentialRepository
                                .findByCredentialIdAndSharedWith(
                                                id,
                                                user)
                                .orElse(null);

                if (shared == null) {
                        return null;
                }

                // =================================================
                // VIEW USER CANNOT EDIT
                // =================================================

                if (!shared.getPermission()
                                .equalsIgnoreCase("EDIT")) {

                        return null;
                }

                // =================================================
                // EDIT USER CAN EDIT
                // =================================================

                existing.setWebsite(
                                credential.getWebsite());

                existing.setUsername(
                                credential.getUsername());

                existing.setPassword(
                                AESUtil.encrypt(
                                                credential.getPassword()));

                return credentialRepository.save(existing);
        }

        // =====================================================
        // DELETE CREDENTIAL
        // =====================================================

        public String deleteCredential(
                        Long id,
                        String email) {

                Credential existing = credentialRepository
                                .findById(id)
                                .orElse(null);

                if (existing == null) {
                        return "Credential not found";
                }

                User user = userRepository
                                .findByEmail(email)
                                .orElse(null);

                if (user == null) {
                        return "User not found";
                }

                // =================================================
                // ONLY OWNER CAN DELETE
                // =================================================

                if (existing.getUser() == null ||
                                !existing.getUser()
                                                .getId()
                                                .equals(user.getId())) {

                        return "Access denied. Only the owner can delete this credential.";
                }

                credentialRepository.deleteById(id);

                return "Credential deleted successfully";
        }
}