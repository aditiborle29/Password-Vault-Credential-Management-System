package com.securevault.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${MAIL_FROM:}")
    private String fromEmail;


    // =========================================================
    // SEND OTP EMAIL
    // =========================================================

    public String sendOtp(
            String toEmail,
            String otp) {

        String subject =
                "Secure Vault - Password Reset OTP";

        String htmlContent =
                "<h2>Password Reset Request</h2>"
                + "<p>Your SecureVault OTP is:</p>"
                + "<h1>" + otp + "</h1>"
                + "<p>This OTP is required to reset your password.</p>"
                + "<p>If you did not request a password reset, "
                + "please ignore this email.</p>"
                + "<p>SecureVault Security Team</p>";

        return sendEmail(
                toEmail,
                subject,
                htmlContent
        );
    }


    // =========================================================
    // LOGIN NOTIFICATION EMAIL
    // =========================================================

    public String sendLoginNotification(
            String toEmail,
            String userName,
            String loginTime,
            String ipAddress) {

        String subject =
                "Secure Vault - New Login Detected";

        String htmlContent =
                "<h2>New Login Detected</h2>"

                + "<p>Hello " + userName + ",</p>"

                + "<p>New login detected on your "
                + "SecureVault account.</p>"

                + "<p><b>Login Date & Time:</b> "
                + loginTime
                + "</p>"

                + "<p><b>Account:</b> "
                + toEmail
                + "</p>"

                + "<p><b>IP Address:</b> "
                + ipAddress
                + "</p>"

                + "<p>If this was not you, please log in to "
                + "SecureVault and review your account security.</p>"

                + "<p>SecureVault Security Team</p>";

        return sendEmail(
                toEmail,
                subject,
                htmlContent
        );
    }


    // =========================================================
    // CREDENTIAL SHARING NOTIFICATION EMAIL
    // =========================================================

    public String sendCredentialSharingNotification(
            String toEmail,
            String ownerName,
            String website,
            String permission) {

        String subject =
                "Secure Vault - Credential Shared With You";

        String htmlContent =
                "<h2>Credential Shared With You</h2>"

                + "<p>Hello,</p>"

                + "<p><b>"
                + ownerName
                + "</b> has shared a credential with you "
                + "in SecureVault.</p>"

                + "<p><b>Website:</b> "
                + website
                + "</p>"

                + "<p><b>Permission:</b> "
                + permission
                + "</p>"

                + "<p>Please log in to your SecureVault account "
                + "to view the shared credential.</p>"

                + "<p><b>For your security, the credential password "
                + "is not included in this email.</b></p>"

                + "<p>SecureVault Security Team</p>";

        return sendEmail(
                toEmail,
                subject,
                htmlContent
        );
    }


    // =========================================================
    // PASSWORD HEALTH NOTIFICATION EMAIL
    // =========================================================

    public String sendPasswordHealthNotification(
            String toEmail,
            String userName,
            String website,
            String healthStatus) {

        String subject =
                "Secure Vault - Password Health Alert";

        String htmlContent =
                "<h2>Password Health Alert</h2>"

                + "<p>Hello "
                + userName
                + ",</p>"

                + "<p>Your SecureVault password health check "
                + "has detected a credential that needs attention.</p>"

                + "<p><b>Website:</b> "
                + website
                + "</p>"

                + "<p><b>Password Status:</b> "
                + healthStatus
                + "</p>"

                + "<p>Please log in to SecureVault and update "
                + "your password to a stronger one.</p>"

                + "<p><b>For your security, your password is "
                + "not included in this email.</b></p>"

                + "<p>SecureVault Security Team</p>";

        return sendEmail(
                toEmail,
                subject,
                htmlContent
        );
    }


    // =========================================================
    // COMMON EMAIL METHOD
    // =========================================================

    private String sendEmail(
            String toEmail,
            String subject,
            String htmlContent) {

        try {

            if (brevoApiKey == null ||
                    brevoApiKey.isBlank()) {

                return "BREVO_API_KEY is missing";
            }

            if (fromEmail == null ||
                    fromEmail.isBlank()) {

                return "MAIL_FROM is missing";
            }


            // Escape characters for JSON
            String escapedHtml =
                    htmlContent
                            .replace("\\", "\\\\")
                            .replace("\"", "\\\"")
                            .replace("\n", "\\n")
                            .replace("\r", "");


            String jsonBody =
                    "{"
                    + "\"sender\":{"
                    + "\"name\":\"SecureVault\","
                    + "\"email\":\""
                    + fromEmail
                    + "\""
                    + "},"

                    + "\"to\":[{"
                    + "\"email\":\""
                    + toEmail
                    + "\""
                    + "}],"

                    + "\"subject\":\""
                    + subject
                    + "\","

                    + "\"htmlContent\":\""
                    + escapedHtml
                    + "\""
                    + "}";


            HttpClient client =
                    HttpClient.newHttpClient();


            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(
                                    URI.create(
                                            "https://api.brevo.com/v3/smtp/email"
                                    )
                            )
                            .header(
                                    "accept",
                                    "application/json"
                            )
                            .header(
                                    "api-key",
                                    brevoApiKey
                            )
                            .header(
                                    "content-type",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(jsonBody)
                            )
                            .build();


            HttpResponse<String> response =
                    client.send(
                            request,
                            HttpResponse.BodyHandlers
                                    .ofString()
                    );


            System.out.println(
                    "EMAIL STATUS = "
                    + response.statusCode()
            );

            System.out.println(
                    "EMAIL RESPONSE = "
                    + response.body()
            );


            if (response.statusCode() >= 200 &&
                    response.statusCode() < 300) {

                return "Email sent successfully";
            }


            return "Email failed: "
                    + response.body();


        } catch (Exception e) {

            System.out.println(
                    "❌ EMAIL ERROR = "
                    + e.getMessage()
            );

            return "Email error: "
                    + e.getMessage();
        }
    }
}

