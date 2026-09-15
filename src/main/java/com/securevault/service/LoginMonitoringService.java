package com.securevault.service;

import com.securevault.entity.AuditLog;
import com.securevault.entity.LoginAttempt;
import com.securevault.entity.SecurityAlert;
import com.securevault.entity.SuspiciousActivity;
import com.securevault.entity.User;

import com.securevault.repository.AuditLogRepository;
import com.securevault.repository.LoginAttemptRepository;
import com.securevault.repository.SecurityAlertRepository;
import com.securevault.repository.SuspiciousActivityRepository;
import com.securevault.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class LoginMonitoringService {

    private final LoginAttemptRepository loginAttemptRepository;
    private final SecurityAlertRepository securityAlertRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public LoginMonitoringService(
            LoginAttemptRepository loginAttemptRepository,
            SecurityAlertRepository securityAlertRepository,
            SuspiciousActivityRepository suspiciousActivityRepository,
            AuditLogRepository auditLogRepository,
            NotificationService notificationService,
            UserRepository userRepository) {

        this.loginAttemptRepository = loginAttemptRepository;
        this.securityAlertRepository = securityAlertRepository;
        this.suspiciousActivityRepository = suspiciousActivityRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
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
                ipAddress
        );

        loginAttemptRepository.save(attempt);

        // =================================================
        // SUCCESSFUL LOGIN
        // =================================================

        if (success) {

            createAuditLog(
                    email,
                    "LOGIN_SUCCESS",
                    "User logged in successfully."
            );

        }

        // =================================================
        // FAILED LOGIN
        // =================================================

        else {

            createAuditLog(
                    email,
                    "LOGIN_FAILED",
                    "Failed login attempt detected."
            );

            // Check suspicious activity
            detectSuspiciousActivity(email);
        }
    }

    // =====================================================
    // SUSPICIOUS ACTIVITY DETECTION
    // =====================================================

    private void detectSuspiciousActivity(String email) {

        // Current time in India
        LocalDateTime now =
                LocalDateTime.now(
                        ZoneId.of("Asia/Kolkata")
                );

        // Five minutes before current time
        LocalDateTime fiveMinutesAgo =
                now.minusMinutes(5);

        long failedAttempts =
                loginAttemptRepository
                        .countByEmailAndSuccessFalseAndTimestampAfter(
                                email,
                                fiveMinutesAgo
                        );

        System.out.println(
                "FAILED LOGIN COUNT FOR " +
                email +
                " = " +
                failedAttempts
        );

        // =================================================
        // 5 OR MORE FAILED LOGINS
        // =================================================

        if (failedAttempts >= 5) {

            String alertType =
                    "MULTIPLE_FAILED_LOGINS";

            String message =
                    failedAttempts +
                    " failed login attempts detected within 5 minutes.";

            // =================================================
            // CHECK EXISTING ACTIVE ALERT
            // =================================================

            boolean alertAlreadyExists =
                    securityAlertRepository
                            .existsByEmailAndAlertTypeAndResolvedFalse(
                                    email,
                                    alertType
                            );

            if (!alertAlreadyExists) {

                // =================================================
                // STORE SUSPICIOUS ACTIVITY
                // =================================================

                SuspiciousActivity suspiciousActivity =
                        new SuspiciousActivity(
                                email,
                                alertType,
                                message,
                                now,
                                "FLAGGED"
                        );

                suspiciousActivityRepository.save(
                        suspiciousActivity
                );

                System.out.println(
                        "SUSPICIOUS ACTIVITY CREATED FOR: " +
                        email
                );

                // =================================================
                // CREATE SECURITY ALERT
                // =================================================

                SecurityAlert alert =
                        new SecurityAlert(
                                email,
                                alertType,
                                message,
                                "HIGH"
                        );

                securityAlertRepository.save(alert);

                System.out.println(
                        "SECURITY ALERT CREATED FOR: " +
                        email
                );

                // =================================================
                // CREATE AUDIT LOG
                // =================================================

                createAuditLog(
                        email,
                        "SUSPICIOUS_ACTIVITY",
                        "Suspicious activity detected: " +
                        message
                );

                createAuditLog(
                        email,
                        "SECURITY_ALERT_CREATED",
                        "HIGH severity security alert generated for multiple failed login attempts."
                );

                // =================================================
                // CREATE IN-APP NOTIFICATION
                // =================================================

                createSuspiciousNotification(
                        email,
                        message
                );
            }
        }
    }

    // =====================================================
    // CREATE SUSPICIOUS ACTIVITY NOTIFICATION
    // =====================================================

    private void createSuspiciousNotification(
            String email,
            String message) {

        try {

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);

            if (user == null) {

                System.out.println(
                        "USER NOT FOUND FOR NOTIFICATION: " +
                        email
                );

                return;
            }

            notificationService.createNotification(
                    user.getId(),
                    "SECURITY_ALERT",
                    "Suspicious Activity Detected",
                    "🚨 " +
                    message +
                    " Please review your account security."
            );

            System.out.println(
                    "SUSPICIOUS ACTIVITY NOTIFICATION CREATED FOR: " +
                    email
            );

        } catch (Exception e) {

            System.out.println(
                    "NOTIFICATION ERROR = " +
                    e.getMessage()
            );
        }
    }

    // =====================================================
    // CREATE AUDIT LOG
    // =====================================================

    private void createAuditLog(
            String email,
            String action,
            String description) {

        AuditLog auditLog =
                new AuditLog(
                        email,
                        action,
                        description
                );

        auditLogRepository.save(auditLog);
    }
}