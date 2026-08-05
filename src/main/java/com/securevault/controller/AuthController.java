package com.securevault.controller;

import com.securevault.dto.LoginRequest;
import com.securevault.dto.VerifyOtpRequest;
import com.securevault.entity.User;
import com.securevault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    // ================= REGISTER =================

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.register(user);
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    // ================= SEND OTP =================

    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String email) {
        return userService.sendOtp(email);
    }

    // ================= VERIFY OTP =================

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyOtpRequest request) {
        return userService.verifyOtpAndResetPassword(request);
    }

}