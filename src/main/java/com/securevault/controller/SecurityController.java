package com.securevault.controller;

import com.securevault.entity.AuditLog;
import com.securevault.entity.LoginAttempt;
import com.securevault.entity.SecurityAlert;
import com.securevault.entity.SuspiciousActivity;

import com.securevault.repository.AuditLogRepository;
import com.securevault.repository.LoginAttemptRepository;
import com.securevault.repository.SecurityAlertRepository;
import com.securevault.repository.SuspiciousActivityRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    // 1. LOGIN ATTEMPTS
    // =====================================================

    @GetMapping("/login-attempts")
    public List<LoginAttempt> getLoginAttempts() {

        return loginAttemptRepository
                .findTop50ByOrderByTimestampDesc();
    }

    // =====================================================
    // 2. SECURITY ALERTS
    // =====================================================

    @GetMapping("/alerts")
    public List<SecurityAlert> getAlerts() {

        return securityAlertRepository
                .findTop50ByOrderByTimestampDesc();
    }

    // =====================================================
    // 3. USER-SPECIFIC ALERTS
    // =====================================================

    @GetMapping("/alerts/{email}")
    public List<SecurityAlert> getUserAlerts(
            @PathVariable String email) {

        return securityAlertRepository
                .findByEmailOrderByTimestampDesc(email);
    }

    // =====================================================
    // 4. SUSPICIOUS ACTIVITIES
    // =====================================================

    @GetMapping("/suspicious-activities")
    public List<SuspiciousActivity> getSuspiciousActivities() {

        return suspiciousActivityRepository
                .findAllByOrderByDetectedAtDesc();
    }

    // =====================================================
    // 5. AUDIT LOGS
    // =====================================================

    @GetMapping("/audit-logs")
    public List<AuditLog> getAuditLogs() {

        return auditLogRepository.findAll();
    }

    // =====================================================
    // 6. RESOLVE SECURITY ALERT
    // =====================================================

    @PutMapping("/alerts/{id}/resolve")
    public String resolveAlert(
            @PathVariable Long id) {

        SecurityAlert alert = securityAlertRepository
                .findById(id)
                .orElse(null);

        if (alert == null) {
            return "Security alert not found";
        }

        alert.setResolved(true);

        securityAlertRepository.save(alert);

        return "Security alert resolved successfully";
    }
}