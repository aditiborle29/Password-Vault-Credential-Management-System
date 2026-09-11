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

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    @Value("${MAIL_FROM:onboarding@resend.dev}")
    private String fromEmail;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendOtp(String toEmail, String otp) {

        try {

            // Create email data
            Map<String, Object> emailData = new HashMap<>();

            emailData.put(
                    "from",
                    "Secure Vault <" + fromEmail + ">");

            emailData.put(
                    "to",
                    new String[] { toEmail });

            emailData.put(
                    "subject",
                    "Secure Vault - Password Reset OTP");

            emailData.put(
                    "html",
                    "<h2>Secure Vault</h2>" +
                            "<p>Hello,</p>" +
                            "<p>Your OTP for resetting your password is:</p>" +
                            "<h1>" + otp + "</h1>" +
                            "<p>This OTP is valid for 5 minutes.</p>" +
                            "<p>Do not share this OTP with anyone.</p>" +
                            "<br>" +
                            "<p>Regards,<br>Secure Vault</p>");

            // Convert data to JSON
            String json = objectMapper.writeValueAsString(emailData);

            // Create HTTP client
            HttpClient client = HttpClient.newHttpClient();

            // Create request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header(
                            "Authorization",
                            "Bearer " + resendApiKey)
                    .header(
                            "Content-Type",
                            "application/json")
                    .POST(
                            HttpRequest.BodyPublishers.ofString(json))
                    .build();

            // Send request
            HttpResponse<String> response = client.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            // Check response
            if (response.statusCode() < 200 ||
                    response.statusCode() >= 300) {

                throw new RuntimeException(
                        "Resend email failed. Status: "
                                + response.statusCode()
                                + ", Response: "
                                + response.body());
            }

            System.out.println(
                    "OTP email sent successfully to: " + toEmail);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to send OTP email: "
                            + e.getMessage(),
                    e);
        }
    }
}