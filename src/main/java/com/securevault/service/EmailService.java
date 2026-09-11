package com.securevault.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    @Value("${MAIL_FROM:onboarding@resend.dev}")
    private String fromEmail;

    public void sendOtp(String toEmail, String otp) {

        Resend resend = new Resend(resendApiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Secure Vault <" + fromEmail + ">")
                .to(toEmail)
                .subject("Secure Vault - Password Reset OTP")
                .html(
                        "<h2>Secure Vault</h2>" +
                                "<p>Hello,</p>" +
                                "<p>Your OTP for resetting your password is:</p>" +
                                "<h1>" + otp + "</h1>" +
                                "<p>This OTP is valid for 5 minutes.</p>" +
                                "<p>Do not share this OTP with anyone.</p>" +
                                "<br>" +
                                "<p>Regards,<br>Secure Vault</p>")
                .build();

        try {

            resend.emails().send(params);

        } catch (ResendException e) {

            throw new RuntimeException(
                    "Unable to send OTP email: " + e.getMessage());
        }
    }
}