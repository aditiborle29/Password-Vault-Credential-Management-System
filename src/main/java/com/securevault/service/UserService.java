package com.securevault.service;

import com.securevault.dto.LoginRequest;
import com.securevault.dto.VerifyOtpRequest;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private LoginMonitoringService loginMonitoringService;

    @Autowired
    private NotificationService notificationService;


    // ================= REGISTER =================

    public String register(User user) {

        if (userRepository
                .findByEmail(user.getEmail())
                .isPresent()) {

            return "Email already exists!";
        }

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        user.setRole("USER");

        userRepository.save(user);

        return "User Registered Successfully";
    }


    // ================= LOGIN =================

    public String login(
            LoginRequest request,
            String ipAddress) {

        String email = request.getEmail();


        // Find user

        User user = userRepository
                .findByEmail(email)
                .orElse(null);


        // ================= USER NOT FOUND =================

        if (user == null) {

            loginMonitoringService.recordLogin(
                    email,
                    false,
                    ipAddress
            );

            return "User not found!";
        }


        // ================= WRONG PASSWORD =================

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            loginMonitoringService.recordLogin(
                    email,
                    false,
                    ipAddress
            );

            return "Invalid Password!";
        }


        // ================= SUCCESSFUL LOGIN =================

        loginMonitoringService.recordLogin(
                email,
                true,
                ipAddress
        );


        // ================= IN-APP LOGIN NOTIFICATION =================

        notificationService.createNotification(
                user.getId(),
                "LOGIN",
                "New Login Detected",
                "New login detected on your SecureVault account."
        );


        // ================= LOGIN EMAIL NOTIFICATION =================

        String loginTime =
        LocalDateTime.now(
                ZoneId.of("Asia/Kolkata")
        ).toString();

        emailService.sendLoginNotification(
                user.getEmail(),
                user.getName(),
                loginTime,
                ipAddress
        );


        return "Login Successful";
    }


    // ================= SEND OTP =================

    public String sendOtp(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {
            return "User not found!";
        }

        String otp =
                otpService.generateOtp(email);

        String result =
                emailService.sendOtp(
                        email,
                        otp
                );

        return result;
    }


    // ================= VERIFY OTP =================

    public String verifyOtpAndResetPassword(
            VerifyOtpRequest request) {

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElse(null);

        if (user == null) {
            return "User not found!";
        }

        boolean validOtp =
                otpService.verifyOtp(
                        request.getEmail(),
                        request.getOtp()
                );

        if (!validOtp) {
            return "Invalid OTP";
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        otpService.removeOtp(
                request.getEmail()
        );

        return "Password Updated Successfully";
    }


    // ================= GET USER BY EMAIL =================

    public User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }
}