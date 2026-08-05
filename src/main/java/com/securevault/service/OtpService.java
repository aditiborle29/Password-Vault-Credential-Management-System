package com.securevault.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();

    public String generateOtp(String email) {

        Random random = new Random();

        String otp = String.valueOf(
                100000 + random.nextInt(900000));

        otpStorage.put(email, otp);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {

        if (!otpStorage.containsKey(email))
            return false;

        return otpStorage.get(email).equals(otp);
    }

    public void removeOtp(String email) {
        otpStorage.remove(email);
    }
}