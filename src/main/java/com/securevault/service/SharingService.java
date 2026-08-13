package com.securevault.service;

import com.securevault.dto.ShareCredentialRequest;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SharingService {

        @Autowired
        private SharedCredentialRepository sharedCredentialRepository;

        @Autowired
        private CredentialRepository credentialRepository;

        @Autowired
        private UserRepository userRepository;

        // ================= SHARE CREDENTIAL =================

        public String shareCredential(ShareCredentialRequest request) {

                User owner = userRepository
                                .findByEmail(request.getOwnerEmail())
                                .orElse(null);

                if (owner == null) {
                        return "Owner not found";
                }

                User sharedWith = userRepository
                                .findByEmail(request.getSharedWithEmail())
                                .orElse(null);

                if (sharedWith == null) {
                        return "User to share with not found";
                }

                Credential credential = credentialRepository
                                .findById(request.getCredentialId())
                                .orElse(null);

                if (credential == null) {
                        return "Credential not found";
                }

                // Make sure only the owner can share
                if (credential.getUser() == null ||
                                !credential.getUser().getId().equals(owner.getId())) {

                        return "Only the owner can share this credential";
                }

                // Check whether already shared
                boolean alreadyShared = sharedCredentialRepository
                                .existsByCredentialIdAndSharedWith(
                                                credential.getId(),
                                                sharedWith);

                if (alreadyShared) {
                        return "Credential already shared with this user";
                }

                SharedCredential sharedCredential = new SharedCredential();

                sharedCredential.setCredential(credential);
                sharedCredential.setOwner(owner);
                sharedCredential.setSharedWith(sharedWith);
                sharedCredential.setPermission(
                                request.getPermission().toUpperCase());

                sharedCredentialRepository.save(sharedCredential);

                return "Credential shared successfully";
        }

        // ================= GET SHARED WITH ME =================

        public List<SharedCredentialResponse> getSharedCredentials(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElse(null);

                if (user == null) {
                        return List.of();
                }

                List<SharedCredential> sharedCredentials = sharedCredentialRepository
                                .findBySharedWith(user);

                return sharedCredentials.stream()
                                .map(shared -> {

                                        Credential credential = shared.getCredential();

                                        SharedCredentialResponse response = new SharedCredentialResponse();

                                        response.setId(shared.getId());

                                        response.setWebsite(
                                                        credential.getWebsite());

                                        response.setUsername(
                                                        credential.getUsername());

                                        response.setPassword(
                                                        AESUtil.decrypt(
                                                                        credential.getPassword()));

                                        response.setPermission(
                                                        shared.getPermission());

                                        return response;
                                })
                                .collect(Collectors.toList());
        }

        // ================= GET ONE SHARED CREDENTIAL =================

        public SharedCredentialResponse getSharedCredentialById(
                        Long id) {

                SharedCredential shared = sharedCredentialRepository
                                .findById(id)
                                .orElse(null);

                if (shared == null) {
                        return null;
                }

                Credential credential = shared.getCredential();

                SharedCredentialResponse response = new SharedCredentialResponse();

                response.setId(shared.getId());

                response.setWebsite(
                                credential.getWebsite());

                response.setUsername(
                                credential.getUsername());

                response.setPassword(
                                AESUtil.decrypt(
                                                credential.getPassword()));

                response.setPermission(
                                shared.getPermission());

                return response;
        }

        // ================= REMOVE SHARING =================

        public String removeSharing(Long id) {

                SharedCredential shared = sharedCredentialRepository
                                .findById(id)
                                .orElse(null);

                if (shared == null) {
                        return "Shared credential not found";
                }

                sharedCredentialRepository.deleteById(id);

                return "Sharing removed successfully";
        }
}