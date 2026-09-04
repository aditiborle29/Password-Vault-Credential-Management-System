package com.securevault.service;

import com.securevault.entity.AuditLog;
import com.securevault.entity.LoginAttempt;
import com.securevault.entity.SecurityAlert;
import com.securevault.entity.SuspiciousActivity;

import com.securevault.repository.AuditLogRepository;
import com.securevault.repository.LoginAttemptRepository;
import com.securevault.repository.SecurityAlertRepository;
import com.securevault.repository.SuspiciousActivityRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LoginMonitoringService {

        private final LoginAttemptRepository loginAttemptRepository;
        private final SecurityAlertRepository securityAlertRepository;
        private final SuspiciousActivityRepository suspiciousActivityRepository;
        private final AuditLogRepository auditLogRepository;

        public LoginMonitoringService(
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
        // RECORD LOGIN
        // =====================================================

        public void recordLogin(
                        String email,
                        boolean success,
                        String ipAddress) {

                // Save login attempt

                LoginAttempt attempt = new LoginAttempt(
                                email,
                                success,
                                ipAddress);

                loginAttemptRepository.save(attempt);

                // Create audit log

                if (success) {

                        createAuditLog(
                                        email,
                                        "LOGIN_SUCCESS",
                                        "User logged in successfully.");

                } else {

                        createAuditLog(
                                        email,
                                        "LOGIN_FAILED",
                                        "Failed login attempt detected.");

                        // Analyze failed login
                        detectSuspiciousActivity(email);
                }
        }

        // =====================================================
        // SUSPICIOUS ACTIVITY DETECTION
        // =====================================================

        private void detectSuspiciousActivity(String email) {

                LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);

                long failedAttempts = loginAttemptRepository
                                .countByEmailAndSuccessFalseAndTimestampAfter(
                                                email,
                                                fiveMinutesAgo);

                /*
                 * Security Rule:
                 *
                 * If 5 or more failed login attempts
                 * occur within 5 minutes,
                 * suspicious activity is detected.
                 */

                if (failedAttempts >= 5) {

                        String alertType = "MULTIPLE_FAILED_LOGINS";

                        // =================================================
                        // CHECK EXISTING ACTIVE ALERT
                        // =================================================

                        boolean alertAlreadyExists = securityAlertRepository
                                        .existsByEmailAndAlertTypeAndResolvedFalse(
                                                        email,
                                                        alertType);

                        /*
                         * If an unresolved alert already exists,
                         * don't create duplicate alerts.
                         */

                        if (!alertAlreadyExists) {

                                // =================================================
                                // STORE SUSPICIOUS ACTIVITY
                                // =================================================

                                SuspiciousActivity suspiciousActivity = new SuspiciousActivity(
                                                email,
                                                alertType,
                                                failedAttempts
                                                                + " failed login attempts detected within 5 minutes.",
                                                LocalDateTime.now(),
                                                "FLAGGED");

                                suspiciousActivityRepository.save(
                                                suspiciousActivity);

                                // =================================================
                                // CREATE SECURITY ALERT
                                // =================================================

                                SecurityAlert alert = new SecurityAlert(
                                                email,
                                                alertType,
                                                failedAttempts
                                                                + " failed login attempts detected within 5 minutes.",
                                                "HIGH");

                                securityAlertRepository.save(alert);

                                // =================================================
                                // CREATE AUDIT LOG
                                // =================================================

                                createAuditLog(
                                                email,
                                                "SUSPICIOUS_ACTIVITY",
                                                "Suspicious activity detected: "
                                                                + failedAttempts
                                                                + " failed login attempts within 5 minutes.");

                                createAuditLog(
                                                email,
                                                "SECURITY_ALERT_CREATED",
                                                "HIGH severity security alert generated for multiple failed login attempts.");
                        }
                }
        }

        // =====================================================
        // CREATE AUDIT LOG
        // =====================================================

        private void createAuditLog(
                        String email,
                        String action,
                        String description) {

                AuditLog auditLog = new AuditLog(
                                email,
                                action,
                                description);

                auditLogRepository.save(auditLog);
        }
}