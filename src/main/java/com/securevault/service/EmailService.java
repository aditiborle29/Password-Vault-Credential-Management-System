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

        public String sendOtp(String toEmail, String otp) {

                try {

                        if (brevoApiKey == null || brevoApiKey.trim().isEmpty()) {
                                return "ERROR: BREVO_API_KEY is missing.";
                        }

                        if (fromEmail == null || fromEmail.trim().isEmpty()) {
                                return "ERROR: MAIL_FROM is missing.";
                        }

                        Map<String, Object> sender = new HashMap<>();
                        sender.put("name", "Secure Vault");
                        sender.put("email", fromEmail);

                        Map<String, String> recipient = new HashMap<>();
                        recipient.put("email", toEmail);

                        Map<String, Object> emailData = new HashMap<>();

                        emailData.put("sender", sender);
                        emailData.put("to", new Map[] { recipient });

                        emailData.put(
                                        "subject",
                                        "Secure Vault - Password Reset OTP");

                        emailData.put(
                                        "htmlContent",
                                        "<h2>Secure Vault</h2>" +
                                                        "<p>Hello,</p>" +
                                                        "<p>Your OTP for resetting your password is:</p>" +
                                                        "<h1>" + otp + "</h1>" +
                                                        "<p>This OTP is valid for 5 minutes.</p>" +
                                                        "<p>Do not share this OTP with anyone.</p>" +
                                                        "<br>" +
                                                        "<p>Regards,<br>Secure Vault</p>");

                        String json = objectMapper.writeValueAsString(emailData);

                        HttpClient client = HttpClient.newHttpClient();

                        HttpRequest request = HttpRequest.newBuilder()
                                        .uri(
                                                        URI.create(
                                                                        "https://api.brevo.com/v3/smtp/email"))
                                        .header(
                                                        "api-key",
                                                        brevoApiKey)
                                        .header(
                                                        "Content-Type",
                                                        "application/json")
                                        .header(
                                                        "Accept",
                                                        "application/json")
                                        .POST(
                                                        HttpRequest.BodyPublishers
                                                                        .ofString(json))
                                        .build();

                        HttpResponse<String> response = client.send(
                                        request,
                                        HttpResponse.BodyHandlers.ofString());

                        System.out.println(
                                        "BREVO STATUS = "
                                                        + response.statusCode());

                        System.out.println(
                                        "BREVO RESPONSE = "
                                                        + response.body());

                        if (response.statusCode() >= 200 &&
                                        response.statusCode() < 300) {

                                return "OTP sent successfully";
                        }

                        return "BREVO ERROR: "
                                        + response.body();

                } catch (Exception e) {

                        System.out.println(
                                        "EMAIL ERROR = "
                                                        + e.getMessage());

                        return "EMAIL ERROR: "
                                        + e.getMessage();
                }
        }
}