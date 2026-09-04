package com.securevault.service;

import com.securevault.entity.Credential;
import com.securevault.entity.LoginAttempt;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.LoginAttemptRepository;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CredentialRepository credentialRepository;
    private final LoginAttemptRepository loginAttemptRepository;

    public ReportService(
            CredentialRepository credentialRepository,
            LoginAttemptRepository loginAttemptRepository) {

        this.credentialRepository = credentialRepository;
        this.loginAttemptRepository = loginAttemptRepository;
    }

    // =====================================================
    // PASSWORD HEALTH REPORT
    // =====================================================

    public Map<String, Object> getPasswordHealthReport() {

        List<Credential> credentials = credentialRepository.findAll();

        int total = credentials.size();

        int strong = 0;
        int medium = 0;
        int weak = 0;

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
        }

        int healthScore = 0;

        if (total > 0) {

            healthScore = (strong * 100 + medium * 60 + weak * 20)
                    / total;
        }

        String overallHealth;

        if (healthScore >= 80) {
            overallHealth = "Excellent";
        } else if (healthScore >= 60) {
            overallHealth = "Good";
        } else if (healthScore >= 40) {
            overallHealth = "Needs Improvement";
        } else {
            overallHealth = "Weak";
        }

        Map<String, Object> report = new HashMap<>();

        report.put("totalCredentials", total);
        report.put("strongPasswords", strong);
        report.put("mediumPasswords", medium);
        report.put("weakPasswords", weak);
        report.put("healthScore", healthScore);
        report.put("overallHealth", overallHealth);

        return report;
    }

    // =====================================================
    // PASSWORD STRENGTH
    // =====================================================

    private String calculatePasswordStrength(String password) {

        if (password == null || password.isEmpty()) {
            return "Weak";
        }

        int score = 0;

        if (password.length() >= 8) {
            score++;
        }

        if (password.matches(".*[A-Z].*")) {
            score++;
        }

        if (password.matches(".*[a-z].*")) {
            score++;
        }

        if (password.matches(".*[0-9].*")) {
            score++;
        }

        if (password.matches(".*[^a-zA-Z0-9].*")) {
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
    // LOGIN ACTIVITY REPORT
    // =====================================================

    public Map<String, Object> getLoginActivityReport() {

        List<LoginAttempt> attempts = loginAttemptRepository
                .findTop50ByOrderByTimestampDesc();

        int total = attempts.size();

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

        report.put("totalAttempts", total);
        report.put("successfulLogins", successful);
        report.put("failedLogins", failed);
        report.put("recentActivities", attempts);

        return report;
    }
}