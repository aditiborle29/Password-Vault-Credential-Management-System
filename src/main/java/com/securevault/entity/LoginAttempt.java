package com.securevault.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "login_attempts")
public class LoginAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private boolean success;

    private String ipAddress;

    private LocalDateTime timestamp;

    public LoginAttempt() {
    }

    public LoginAttempt(
            String email,
            boolean success,
            String ipAddress) {

        this.email = email;
        this.success = success;
        this.ipAddress = ipAddress;

        // Store login time in IST
        this.timestamp =
                LocalDateTime.now(
                        ZoneId.of("Asia/Kolkata")
                );
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}