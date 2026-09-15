
package com.securevault.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${MAIL_FROM:}")
    private String fromEmail;

    private final ObjectMapper objectMapper = new ObjectMapper();


    // =====================================================
    // SEND OTP EMAIL
    // =====================================================

    public String sendOtp(String toEmail, String otp) {

        try {

            if (brevoApiKey == null ||
                    brevoApiKey.trim().isEmpty()) {

                return "ERROR: BREVO_API_KEY is missing.";
            }

            if (fromEmail == null ||
                    fromEmail.trim().isEmpty()) {

                return "ERROR: MAIL_FROM is missing.";
            }

            Map<String, Object> sender = new HashMap<>();
            sender.put("name", "Secure Vault");
            sender.put("email", fromEmail);

            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", toEmail);

            Map<String, Object> emailData = new HashMap<>();

            emailData.put("sender", sender);
            emailData.put(
                    "to",
                    new Map[]{recipient}
            );

            emailData.put(
                    "subject",
                    "Secure Vault - Password Reset OTP"
            );

            emailData.put(
                    "htmlContent",
                    "<h2>Secure Vault</h2>" +
                    "<p>Hello,</p>" +
                    "<p>Your OTP for resetting your password is:</p>" +
                    "<h1>" + otp + "</h1>" +
                    "<p>This OTP is valid for 5 minutes.</p>" +
                    "<p>Do not share this OTP with anyone.</p>" +
                    "<br>" +
                    "<p>Regards,<br>Secure Vault</p>"
            );

            String json =
                    objectMapper.writeValueAsString(emailData);

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
                                    "api-key",
                                    brevoApiKey
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .header(
                                    "Accept",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(json)
                            )
                            .build();

            HttpResponse<String> response =
                    client.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            System.out.println(
                    "BREVO STATUS = "
                            + response.statusCode()
            );

            System.out.println(
                    "BREVO RESPONSE = "
                            + response.body()
            );

            if (response.statusCode() >= 200 &&
                    response.statusCode() < 300) {

                return "OTP sent successfully";
            }

            return "BREVO ERROR: "
                    + response.body();

        } catch (Exception e) {

            System.out.println(
                    "EMAIL ERROR = "
                            + e.getMessage()
            );

            return "EMAIL ERROR: "
                    + e.getMessage();
        }
    }


    // =====================================================
    // SEND LOGIN NOTIFICATION EMAIL
    // =====================================================

    public String sendLoginNotification(
            String toEmail,
            String userName,
            String loginTime,
            String ipAddress) {

        try {

            if (brevoApiKey == null ||
                    brevoApiKey.trim().isEmpty()) {

                return "ERROR: BREVO_API_KEY is missing.";
            }

            if (fromEmail == null ||
                    fromEmail.trim().isEmpty()) {

                return "ERROR: MAIL_FROM is missing.";
            }

            Map<String, Object> sender =
                    new HashMap<>();

            sender.put(
                    "name",
                    "Secure Vault"
            );

            sender.put(
                    "email",
                    fromEmail
            );

            Map<String, String> recipient =
                    new HashMap<>();

            recipient.put(
                    "email",
                    toEmail
            );

            Map<String, Object> emailData =
                    new HashMap<>();

            emailData.put(
                    "sender",
                    sender
            );

            emailData.put(
                    "to",
                    new Map[]{recipient}
            );

            emailData.put(
                    "subject",
                    "Secure Vault - New Login Detected"
            );

            emailData.put(
                    "htmlContent",

                    "<h2>🔐 Secure Vault</h2>" +

                    "<p>Hello "
                    + userName
                    + ",</p>" +

                    "<p><strong>" +
                    "New login detected on your SecureVault account." +
                    "</strong></p>" +

                    "<hr>" +

                    "<p><strong>Login Date & Time:</strong><br>"
                    + loginTime
                    + "</p>" +

                    "<p><strong>Account:</strong><br>"
                    + toEmail
                    + "</p>" +

                    "<p><strong>IP Address:</strong><br>"
                    + ipAddress
                    + "</p>" +

                    "<p>If this login was not made by you, " +
                    "please check your SecureVault account immediately.</p>" +

                    "<br>" +

                    "<p>Regards,<br>" +
                    "Secure Vault Team</p>"
            );

            String json =
                    objectMapper.writeValueAsString(
                            emailData
                    );

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
                                    "api-key",
                                    brevoApiKey
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .header(
                                    "Accept",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(json)
                            )
                            .build();

            HttpResponse<String> response =
                    client.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            System.out.println(
                    "LOGIN EMAIL STATUS = "
                            + response.statusCode()
            );

            System.out.println(
                    "LOGIN EMAIL RESPONSE = "
                            + response.body()
            );

            if (response.statusCode() >= 200 &&
                    response.statusCode() < 300) {

                return "Login email sent successfully";
            }

            return "LOGIN EMAIL ERROR: "
                    + response.body();

        } catch (Exception e) {

            System.out.println(
                    "LOGIN EMAIL ERROR = "
                            + e.getMessage()
            );

            return "LOGIN EMAIL ERROR: "
                    + e.getMessage();
        }
    }


    // =====================================================
    // SEND CREDENTIAL SHARING NOTIFICATION EMAIL
    // =====================================================

    public String sendCredentialSharingNotification(
            String toEmail,
            String ownerName,
            String website,
            String permission) {

        try {

            if (brevoApiKey == null ||
                    brevoApiKey.trim().isEmpty()) {

                return "ERROR: BREVO_API_KEY is missing.";
            }

            if (fromEmail == null ||
                    fromEmail.trim().isEmpty()) {

                return "ERROR: MAIL_FROM is missing.";
            }


            // ================= SENDER =================

            Map<String, Object> sender =
                    new HashMap<>();

            sender.put(
                    "name",
                    "Secure Vault"
            );

            sender.put(
                    "email",
                    fromEmail
            );


            // ================= RECIPIENT =================

            Map<String, String> recipient =
                    new HashMap<>();

            recipient.put(
                    "email",
                    toEmail
            );


            // ================= EMAIL DATA =================

            Map<String, Object> emailData =
                    new HashMap<>();

            emailData.put(
                    "sender",
                    sender
            );

            emailData.put(
                    "to",
                    new Map[]{recipient}
            );

            emailData.put(
                    "subject",
                    "Secure Vault - Credential Shared With You"
            );


            // IMPORTANT:
            // DO NOT include the credential password
            // in this email.

            emailData.put(
                    "htmlContent",

                    "<h2>🔗 Secure Vault</h2>" +

                    "<p>Hello,</p>" +

                    "<p><strong>" +
                    "A credential has been shared with you." +
                    "</strong></p>" +

                    "<hr>" +

                    "<p><strong>Shared By:</strong><br>" +
                    ownerName +
                    "</p>" +

                    "<p><strong>Website:</strong><br>" +
                    website +
                    "</p>" +

                    "<p><strong>Permission:</strong><br>" +
                    permission +
                    "</p>" +

                    "<p>" +
                    "Please log in to your SecureVault account " +
                    "to access the shared credential." +
                    "</p>" +

                    "<p><strong>" +
                    "For security reasons, the credential password " +
                    "is not included in this email." +
                    "</strong></p>" +

                    "<br>" +

                    "<p>Regards,<br>" +
                    "Secure Vault Team</p>"
            );


            // ================= CONVERT TO JSON =================

            String json =
                    objectMapper.writeValueAsString(
                            emailData
                    );


            // ================= SEND USING BREVO =================

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
                                    "api-key",
                                    brevoApiKey
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .header(
                                    "Accept",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(json)
                            )
                            .build();


            HttpResponse<String> response =
                    client.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );


            System.out.println(
                    "SHARING EMAIL STATUS = "
                            + response.statusCode()
            );

            System.out.println(
                    "SHARING EMAIL RESPONSE = "
                            + response.body()
            );


            if (response.statusCode() >= 200 &&
                    response.statusCode() < 300) {

                return "Credential sharing email sent successfully";
            }


            return "SHARING EMAIL ERROR: "
                    + response.body();


        } catch (Exception e) {

            System.out.println(
                    "SHARING EMAIL ERROR = "
                            + e.getMessage()
            );

            return "SHARING EMAIL ERROR: "
                    + e.getMessage();
        }
    }
}