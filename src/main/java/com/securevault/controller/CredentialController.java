package com.securevault.controller;

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

    // Add Credential
    @PostMapping
    public Credential addCredential(@RequestBody Credential credential) {
        return credentialService.saveCredential(credential);
    }

    // Get All Credentials
    @GetMapping
    public List<Credential> getAllCredentials() {
        return credentialService.getAllCredentials();
    }

    @GetMapping("/test")
    public String test() {
        return "Credential Controller Working";
    }

    @GetMapping("/{id}")
    public Credential getCredentialById(@PathVariable Long id) {
        return credentialService.getCredentialById(id);
    }

    @PutMapping("/{id}")
    public Credential updateCredential(@PathVariable Long id,
            @RequestBody Credential credential) {
        return credentialService.updateCredential(id, credential);
    }

}
