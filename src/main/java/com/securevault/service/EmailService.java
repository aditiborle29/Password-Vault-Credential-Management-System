package com.securevault.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Secure Vault - Password Reset OTP");

        message.setText(
                "Hello,\n\n" +
                        "Your OTP for resetting your password is:\n\n" +
                        otp +
                        "\n\nThis OTP is valid for 5 minutes.\n\n" +
                        "Do not share this OTP with anyone.\n\n" +
                        "Regards,\nSecure Vault");

        mailSender.send(message);
    }
}