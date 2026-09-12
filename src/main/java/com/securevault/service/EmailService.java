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

        @Value("${RESEND_API_KEY:}")
        private String resendApiKey;

        @Value("${MAIL_FROM:onboarding@resend.dev}")
        private String fromEmail;

        private final ObjectMapper objectMapper = new ObjectMapper();

        public String sendOtp(String toEmail, String otp) {

                try {

                        // Check API key
                        if (resendApiKey == null || resendApiKey.trim().isEmpty()) {
                                return "ERROR: RESEND_API_KEY is missing in Render.";
                        }

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

                        String json = objectMapper.writeValueAsString(emailData);

                        HttpClient client = HttpClient.newHttpClient();

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

                        HttpResponse<String> response = client.send(
                                        request,
                                        HttpResponse.BodyHandlers.ofString());

                        System.out.println(
                                        "RESEND STATUS = " + response.statusCode());

                        System.out.println(
                                        "RESEND RESPONSE = " + response.body());

                        if (response.statusCode() >= 200 &&
                                        response.statusCode() < 300) {

                                return "OTP sent successfully";
                        }

                        return "RESEND ERROR: " + response.body();

                } catch (Exception e) {

                        System.out.println(
                                        "EMAIL ERROR = " + e.getMessage());

                        return "EMAIL ERROR: " + e.getMessage();
                }
        }
}