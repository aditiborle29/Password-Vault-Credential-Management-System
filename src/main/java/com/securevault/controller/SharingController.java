package com.securevault.controller;

import com.securevault.dto.ShareCredentialRequest;
import com.securevault.dto.SharedCredentialResponse;
import com.securevault.service.SharingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sharing")
@CrossOrigin(origins = "http://localhost:5173")
public class SharingController {

    @Autowired
    private SharingService sharingService;

    // ================= SHARE =================

    @PostMapping
    public String shareCredential(
            @RequestBody ShareCredentialRequest request) {

        return sharingService.shareCredential(request);
    }

    // ================= GET SHARED WITH ME =================

    @GetMapping("/shared")
    public List<SharedCredentialResponse> getSharedCredentials(
            @RequestParam String email) {

        return sharingService.getSharedCredentials(email);
    }

    // ================= GET ONE =================

    @GetMapping("/{id}")
    public SharedCredentialResponse getSharedCredentialById(
            @PathVariable Long id) {

        return sharingService.getSharedCredentialById(id);
    }

    // ================= REMOVE SHARING =================

    @DeleteMapping("/{id}")
    public String removeSharing(
            @PathVariable Long id) {

        return sharingService.removeSharing(id);
    }
}