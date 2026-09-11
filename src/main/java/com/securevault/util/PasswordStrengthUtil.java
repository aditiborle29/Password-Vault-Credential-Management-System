package com.securevault.util;

public class PasswordStrengthUtil {

    private PasswordStrengthUtil() {
        // Utility class
    }

    /**
     * Calculates password strength based on 5 criteria:
     *
     * 1. Minimum 8 characters
     * 2. Uppercase letter
     * 3. Lowercase letter
     * 4. Number
     * 5. Special character
     *
     * Score:
     * 4-5 = STRONG
     * 3 = MEDIUM
     * 0-2 = WEAK
     */
    public static String calculateStrength(String password) {

        if (password == null || password.trim().isEmpty()) {
            return "WEAK";
        }

        int score = 0;

        // 1. Length
        if (password.length() >= 8) {
            score++;
        }

        // 2. Uppercase
        if (password.matches(".*[A-Z].*")) {
            score++;
        }

        // 3. Lowercase
        if (password.matches(".*[a-z].*")) {
            score++;
        }

        // 4. Number
        if (password.matches(".*[0-9].*")) {
            score++;
        }

        // 5. Special character
        if (password.matches(".*[^a-zA-Z0-9].*")) {
            score++;
        }

        if (score >= 4) {
            return "STRONG";
        }

        if (score >= 3) {
            return "MEDIUM";
        }

        return "WEAK";
    }
}