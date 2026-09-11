package com.securevault.controller;

import com.securevault.entity.Credential;
import com.securevault.entity.LoginAttempt;
import com.securevault.entity.User;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.LoginAttemptRepository;
import com.securevault.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportController {

    private final CredentialRepository credentialRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final UserRepository userRepository;

    public ReportController(
            CredentialRepository credentialRepository,
            LoginAttemptRepository loginAttemptRepository,
            UserRepository userRepository) {

        this.credentialRepository = credentialRepository;
        this.loginAttemptRepository = loginAttemptRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // PASSWORD HEALTH REPORT - USER SPECIFIC
    // =====================================================

    public Map<String, Object> getPasswordHealthReport(
            String email) {

        // -------------------------------------------------
        // Find logged-in user
        // -------------------------------------------------

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // -------------------------------------------------
        // Get ONLY this user's credentials
        // -------------------------------------------------

        List<Credential> credentials = credentialRepository.findByUser(user);

        int total = credentials.size();

        int strong = 0;
        int medium = 0;
        int weak = 0;

        List<Map<String, Object>> passwordDetails = new ArrayList<>();

        // -------------------------------------------------
        // Analyze passwords
        // -------------------------------------------------

        for (Credential credential : credentials) {

            String password = credential.getPassword();

            String strength = calculatePasswordStrength(password);

            if ("Strong".equals(strength)) {

                strong++;

            } else if ("Medium".equals(strength)) {

                medium++;

            } else {

                weak++;
            }

            // -------------------------------------------------
            // Do not return actual passwords
            // -------------------------------------------------

            Map<String, Object> detail = new HashMap<>();

            detail.put(
                    "credentialId",
                    credential.getId());

            detail.put(
                    "website",
                    credential.getWebsite());

            detail.put(
                    "strength",
                    strength);

            passwordDetails.add(detail);
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

        // Length
        if (password.length() >= 8) {
            score++;
        }

        // Uppercase
        if (password.matches(".*[A-Z].*")) {
            score++;
        }

        // Lowercase
        if (password.matches(".*[a-z].*")) {
            score++;
        }

        // Number
        if (password.matches(".*\\d.*")) {
            score++;
        }

        // Special character
        if (password.matches(
                ".*[^a-zA-Z0-9].*")) {

            score++;
        }

        if (score >= 4) {
            return "Strong";

        } else if (score >= 3) {
            return "Medium";

        } else {
            return "Weak";
        }
    }

    // =====================================================
    // LOGIN ACTIVITY REPORT - USER SPECIFIC
    // =====================================================

    public Map<String, Object> getLoginActivityReport(
            String email) {

        // -------------------------------------------------
        // Get ONLY this user's login attempts
        // -------------------------------------------------

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