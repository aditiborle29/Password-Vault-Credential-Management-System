package com.securevault.service;

import com.securevault.entity.Credential;
import com.securevault.entity.LoginAttempt;
import com.securevault.entity.User;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.LoginAttemptRepository;
import com.securevault.repository.UserRepository;
import com.securevault.util.AESUtil;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CredentialRepository credentialRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final UserRepository userRepository;

    public ReportService(
            CredentialRepository credentialRepository,
            LoginAttemptRepository loginAttemptRepository,
            UserRepository userRepository) {

        this.credentialRepository = credentialRepository;

        this.loginAttemptRepository = loginAttemptRepository;

        this.userRepository = userRepository;
    }

    // =====================================================
    // PASSWORD HEALTH REPORT
    // =====================================================

    public Map<String, Object> getPasswordHealthReport(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"));

        // Get only logged-in user's credentials

        List<Credential> credentials = credentialRepository.findByUser(user);

        int total = credentials.size();

        int strong = 0;
        int medium = 0;
        int weak = 0;

        List<Map<String, Object>> passwordDetails = new ArrayList<>();

        // =================================================
        // ANALYZE EACH PASSWORD
        // =================================================

        for (Credential credential : credentials) {

            String storedPassword = credential.getPassword();

            String originalPassword = null;

            // -------------------------------------------------
            // Decrypt password
            // -------------------------------------------------

            try {

                if (storedPassword != null &&
                        !storedPassword.isEmpty()) {

                    originalPassword = AESUtil.decrypt(
                            storedPassword);
                }

            } catch (Exception e) {

                originalPassword = null;
            }

            // -------------------------------------------------
            // Calculate strength
            // -------------------------------------------------

            String strength = calculatePasswordStrength(
                    originalPassword);

            // -------------------------------------------------
            // Count
            // -------------------------------------------------

            if ("Strong".equals(strength)) {

                strong++;

            } else if ("Medium".equals(strength)) {

                medium++;

            } else {

                weak++;
            }

            // -------------------------------------------------
            // Safe response
            // -------------------------------------------------

            Map<String, Object> details = new HashMap<>();

            details.put(
                    "credentialId",
                    credential.getId());

            details.put(
                    "website",
                    credential.getWebsite());

            details.put(
                    "strength",
                    strength);

            passwordDetails.add(
                    details);
        }

        // =====================================================
        // HEALTH SCORE
        // =====================================================

        double healthScore = 0;

        if (total > 0) {

            healthScore = ((strong * 100.0)
                    +
                    (medium * 60.0)
                    +
                    (weak * 20.0))
                    / total;
        }

        healthScore = Math.round(
                healthScore * 100.0) / 100.0;

        // =====================================================
        // OVERALL HEALTH
        // =====================================================

        String overallHealth;

        if (total == 0) {

            overallHealth = "No Data";

        } else if (healthScore >= 80) {

            overallHealth = "Excellent";

        } else if (healthScore >= 60) {

            overallHealth = "Good";

        } else if (healthScore >= 40) {

            overallHealth = "Needs Improvement";

        } else {

            overallHealth = "Weak";
        }

        // =====================================================
        // RESPONSE
        // =====================================================

        Map<String, Object> report = new HashMap<>();

        report.put(
                "email",
                email);

        report.put(
                "totalCredentials",
                total);

        report.put(
                "strongPasswords",
                strong);

        report.put(
                "mediumPasswords",
                medium);

        report.put(
                "weakPasswords",
                weak);

        report.put(
                "healthScore",
                healthScore);

        report.put(
                "overallHealth",
                overallHealth);

        report.put(
                "passwordDetails",
                passwordDetails);

        return report;
    }

    // =====================================================
    // PASSWORD STRENGTH
    // =====================================================

    private String calculatePasswordStrength(
            String password) {

        if (password == null ||
                password.isEmpty()) {

            return "Weak";
        }

        int score = 0;

        // 1. Length >= 8

        if (password.length() >= 8) {
            score++;
        }

        // 2. Uppercase

        if (password.matches(
                ".*[A-Z].*")) {

            score++;
        }

        // 3. Lowercase

        if (password.matches(
                ".*[a-z].*")) {

            score++;
        }

        // 4. Number

        if (password.matches(
                ".*[0-9].*")) {

            score++;
        }

        // 5. Special character

        if (password.matches(
                ".*[^a-zA-Z0-9].*")) {

            score++;
        }

        // IMPORTANT:
        // Same rules as AddCredential

        if (score <= 2) {

            return "Weak";
        }

        if (score <= 4) {

            return "Medium";
        }

        return "Strong";
    }

    // =====================================================
    // LOGIN ACTIVITY REPORT
    // =====================================================

    public Map<String, Object> getLoginActivityReport(
            String email) {

        List<LoginAttempt> attempts = loginAttemptRepository
                .findTop50ByEmailOrderByTimestampDesc(
                        email);

        int successful = 0;
        int failed = 0;

        for (LoginAttempt attempt : attempts) {

            if (attempt.isSuccess()) {

                successful++;

            } else {

                failed++;
            }
        }

        Map<String, Object> report = new HashMap<>();

        report.put(
                "email",
                email);

        report.put(
                "totalAttempts",
                attempts.size());

        report.put(
                "successfulLogins",
                successful);

        report.put(
                "failedLogins",
                failed);

        report.put(
                "recentActivities",
                attempts);

        return report;
    }
}