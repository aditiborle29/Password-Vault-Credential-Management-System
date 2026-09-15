
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

        // ================= EMAIL SERVICE =================

        @Autowired
        private EmailService emailService;


        // ================= SHARING REPOSITORY =================

        @Autowired
        private SharedCredentialRepository sharedCredentialRepository;


        // ================= CREDENTIAL REPOSITORY =================

        @Autowired
        private CredentialRepository credentialRepository;


        // ================= USER REPOSITORY =================

        @Autowired
        private UserRepository userRepository;


        // ================= NOTIFICATION SERVICE =================

        @Autowired
        private NotificationService notificationService;


        // =====================================================
        // SHARE CREDENTIAL
        // =====================================================

        public String shareCredential(
                        ShareCredentialRequest request) {

                // ================= FIND OWNER =================

                User owner = userRepository
                                .findByEmail(
                                                request.getOwnerEmail())
                                .orElse(null);

                if (owner == null) {
                        return "Owner not found";
                }


                // ================= FIND RECIPIENT =================

                User sharedWith = userRepository
                                .findByEmail(
                                                request.getSharedWithEmail())
                                .orElse(null);

                if (sharedWith == null) {
                        return "User to share with not found";
                }


                // ================= FIND CREDENTIAL =================

                Credential credential = credentialRepository
                                .findById(
                                                request.getCredentialId())
                                .orElse(null);

                if (credential == null) {
                        return "Credential not found";
                }


                // ================= CHECK OWNER =================

                if (credential.getUser() == null ||
                                !credential.getUser()
                                                .getId()
                                                .equals(owner.getId())) {

                        return "Only the owner can share this credential";
                }


                // ================= CHECK ALREADY SHARED =================

                boolean alreadyShared =
                                sharedCredentialRepository
                                                .existsByCredentialIdAndSharedWith(
                                                                credential.getId(),
                                                                sharedWith);

                if (alreadyShared) {

                        return "Credential already shared with this user";
                }


                // =====================================================
                // CREATE SHARED CREDENTIAL
                // =====================================================

                SharedCredential sharedCredential =
                                new SharedCredential();

                sharedCredential.setCredential(
                                credential);

                sharedCredential.setOwner(
                                owner);

                sharedCredential.setSharedWith(
                                sharedWith);

                sharedCredential.setPermission(
                                request.getPermission()
                                                .toUpperCase());


                sharedCredentialRepository.save(
                                sharedCredential);


                // =====================================================
                // CREATE IN-APP NOTIFICATION
                // =====================================================

                try {

                        String notificationMessage =
                                        "A credential has been shared with you by "
                                        + owner.getName()
                                        + ". Permission: "
                                        + request.getPermission()
                                                        .toUpperCase()
                                        + ". Please open SecureVault to view it.";


                        notificationService.createNotification(

                                        sharedWith.getId(),

                                        "CREDENTIAL_SHARED",

                                        "Credential Shared With You",

                                        notificationMessage
                        );


                        System.out.println(
                                        "✅ CREDENTIAL SHARING NOTIFICATION CREATED FOR: "
                                        + sharedWith.getEmail()
                        );

                } catch (Exception e) {

                        System.out.println(
                                        "❌ SHARING NOTIFICATION ERROR: "
                                        + e.getMessage()
                        );
                }


                // =====================================================
                // SEND EMAIL NOTIFICATION
                // =====================================================

                try {

                        String emailResult =
                                        emailService
                                                        .sendCredentialSharingNotification(

                                                                        sharedWith.getEmail(),

                                                                        owner.getName(),

                                                                        credential.getWebsite(),

                                                                        request.getPermission()
                                                                                        .toUpperCase()
                                                        );


                        System.out.println(
                                        "SHARING EMAIL RESULT = "
                                        + emailResult
                        );


                } catch (Exception e) {

                        System.out.println(
                                        "❌ SHARING EMAIL ERROR: "
                                        + e.getMessage()
                        );
                }


                // =====================================================
                // SUCCESS
                // =====================================================

                return "Credential shared successfully";
        }


        // =====================================================
        // GET SHARED WITH ME
        // =====================================================

        public List<SharedCredentialResponse> getSharedCredentials(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElse(null);

                if (user == null) {
                        return List.of();
                }


                List<SharedCredential> sharedCredentials =
                                sharedCredentialRepository
                                                .findBySharedWith(user);


                return sharedCredentials.stream()
                                .map(shared -> {

                                        Credential credential =
                                                        shared.getCredential();

                                        SharedCredentialResponse response =
                                                        new SharedCredentialResponse();


                                        response.setId(
                                                        shared.getId());


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


        // =====================================================
        // GET ONE SHARED CREDENTIAL
        // =====================================================

        public SharedCredentialResponse getSharedCredentialById(
                        Long id) {

                SharedCredential shared =
                                sharedCredentialRepository
                                                .findById(id)
                                                .orElse(null);

                if (shared == null) {
                        return null;
                }


                Credential credential =
                                shared.getCredential();


                SharedCredentialResponse response =
                                new SharedCredentialResponse();


                response.setId(
                                shared.getId());


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


        // =====================================================
        // REMOVE SHARING
        // =====================================================

        public String removeSharing(
                        Long id) {

                SharedCredential shared =
                                sharedCredentialRepository
                                                .findById(id)
                                                .orElse(null);

                if (shared == null) {
                        return "Shared credential not found";
                }


                sharedCredentialRepository.deleteById(
                                id);


                return "Sharing removed successfully";
        }
}
