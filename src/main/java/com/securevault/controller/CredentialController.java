package com.securevault.controller;

import com.securevault.dto.SharedCredentialResponse;
import com.securevault.entity.Credential;
import com.securevault.service.CredentialService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
@CrossOrigin(origins = "http://localhost:5173")
public class CredentialController {

        @Autowired
        private CredentialService credentialService;

        // ADD CREDENTIAL
        @PostMapping
        public Credential addCredential(
                        @RequestBody Credential credential) {

                return credentialService.saveCredential(credential);
        }

        // GET MY CREDENTIALS
        @GetMapping
        public List<Credential> getAllCredentials(
                        @RequestParam String email) {

                return credentialService.getAllCredentials(email);
        }

        // GET SHARED CREDENTIALS
        @GetMapping("/shared")
        public List<SharedCredentialResponse> getSharedCredentials(
                        @RequestParam String email) {

                return credentialService.getSharedCredentials(email);
        }

        // GET CREDENTIAL BY ID
        @GetMapping("/{id}")
        public Credential getCredentialById(
                        @PathVariable Long id) {

                return credentialService.getCredentialById(id);
        }

        // UPDATE CREDENTIAL
        @PutMapping("/{id}")
        public Credential updateCredential(
                        @PathVariable Long id,
                        @RequestParam String email,
                        @RequestBody Credential credential) {

                return credentialService.updateCredential(
                                id,
                                credential,
                                email);
        }

        // DELETE CREDENTIAL
        @DeleteMapping("/{id}")
        public String deleteCredential(
                        @PathVariable Long id,
                        @RequestParam String email) {

                return credentialService.deleteCredential(
                                id,
                                email);
        }

        // TEST
        @GetMapping("/test")
        public String test() {

                return "Credential Controller Working";
        }
}