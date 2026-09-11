package com.securevault.controller;

import com.securevault.entity.AuditLog;
import com.securevault.entity.LoginAttempt;
import com.securevault.entity.SecurityAlert;
import com.securevault.entity.SuspiciousActivity;

import com.securevault.repository.AuditLogRepository;
import com.securevault.repository.LoginAttemptRepository;
import com.securevault.repository.SecurityAlertRepository;
import com.securevault.repository.SuspiciousActivityRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:5173")
public class SecurityController {

    private final LoginAttemptRepository loginAttemptRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final AuditLogRepository auditLogRepository;

    public SecurityController(
            LoginAttemptRepository loginAttemptRepository,
            SecurityAlertRepository securityAlertRepository,
            SuspiciousActivityRepository suspiciousActivityRepository,
            AuditLogRepository auditLogRepository) {

        this.loginAttemptRepository = loginAttemptRepository;
        this.securityAlertRepository = securityAlertRepository;
        this.suspiciousActivityRepository = suspiciousActivityRepository;
        this.auditLogRepository = auditLogRepository;
    }

    // =====================================================
    // 1. USER-SPECIFIC LOGIN ATTEMPTS
    // =====================================================

    @GetMapping("/login-attempts")
    public ResponseEntity<?> getLoginAttempts(
            @RequestParam String email) {

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Email is required"));
        }

        List<LoginAttempt> attempts = loginAttemptRepository.findTop50ByEmailOrderByTimestampDesc(email);

        return ResponseEntity.ok(attempts);
    }

    // =====================================================
    // 2. USER-SPECIFIC SECURITY ALERTS
    // =====================================================

    @GetMapping("/alerts")
    public ResponseEntity<?> getAlerts(
            @RequestParam String email) {

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Email is required"));
        }

        List<SecurityAlert> alerts = securityAlertRepository.findTop50ByEmailOrderByTimestampDesc(email);

        return ResponseEntity.ok(alerts);
    }

    // =====================================================
    // 3. USER-SPECIFIC ALERTS
    // =====================================================

    @GetMapping("/alerts/{email}")
    public ResponseEntity<?> getUserAlerts(
            @PathVariable String email) {

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Email is required"));
        }

        return ResponseEntity.ok(
                securityAlertRepository
                        .findByEmailOrderByTimestampDesc(email));
    }

    // =====================================================
    // 4. USER-SPECIFIC SUSPICIOUS ACTIVITIES
    // =====================================================

    @GetMapping("/suspicious-activities")
    public ResponseEntity<?> getSuspiciousActivities(
            @RequestParam String email) {

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Email is required"));
        }

        return ResponseEntity.ok(
                suspiciousActivityRepository
                        .findByUserEmailOrderByDetectedAtDesc(email));
    }

    // =====================================================
    // 5. USER-SPECIFIC AUDIT LOGS
    // =====================================================

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(
            @RequestParam String email) {

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Email is required"));
        }

        return ResponseEntity.ok(
                auditLogRepository
                        .findByUserEmailOrderByTimestampDesc(email));
    }

    // =====================================================
    // 6. RESOLVE USER'S OWN SECURITY ALERT
    // =====================================================

    @PutMapping("/alerts/{id}/resolve")
    public ResponseEntity<?> resolveAlert(
            @PathVariable Long id,
            @RequestParam String email) {

        SecurityAlert alert = securityAlertRepository
                .findById(id)
                .orElse(null);

        if (alert == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Security alert not found"));
        }

        // Important:
        // User can resolve only their own alert
        if (!alert.getEmail().equalsIgnoreCase(email)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "You are not allowed to resolve this alert"));
        }

        alert.setResolved(true);

        securityAlertRepository.save(alert);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Security alert resolved successfully"));
    }
}