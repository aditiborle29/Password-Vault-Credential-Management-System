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

    @PostMapping
    public Credential addCredential(@RequestBody Credential credential) {
        return credentialService.saveCredential(credential);
    }

    @GetMapping
    public List<Credential> getAllCredentials(@RequestParam String email) {
        return credentialService.getAllCredentials(email);
    }

    @GetMapping("/{id}")
    public Credential getCredentialById(@PathVariable Long id) {
        return credentialService.getCredentialById(id);
    }

    @PutMapping("/{id}")
    public Credential updateCredential(
            @PathVariable Long id,
            @RequestBody Credential credential) {

        return credentialService.updateCredential(id, credential);
    }

    @DeleteMapping("/{id}")
    public String deleteCredential(@PathVariable Long id) {
        credentialService.deleteCredential(id);
        return "Credential Deleted Successfully";
    }

    @GetMapping("/test")
    public String test() {
        return "Credential Controller Working";
    }
}