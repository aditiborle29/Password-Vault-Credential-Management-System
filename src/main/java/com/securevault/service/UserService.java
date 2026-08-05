package com.securevault.service;

import com.securevault.dto.ForgotPasswordRequest;
import com.securevault.dto.LoginRequest;
import com.securevault.dto.VerifyOtpRequest;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    // ================= REGISTER =================

    public String register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // ================= LOGIN =================

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return "User not found!";
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Invalid Password!";
        }

        return "Login Successful";
    }

    // ================= SEND OTP =================

    public String sendOtp(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return "User not found!";
        }

        String otp = otpService.generateOtp(email);

        emailService.sendOtp(email, otp);

        return "OTP sent successfully";
    }

    // ================= VERIFY OTP =================

    public String verifyOtpAndResetPassword(VerifyOtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return "User not found!";
        }

        boolean validOtp = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp());

        if (!validOtp) {
            return "Invalid OTP";
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        otpService.removeOtp(request.getEmail());

        return "Password Updated Successfully";
    }

}