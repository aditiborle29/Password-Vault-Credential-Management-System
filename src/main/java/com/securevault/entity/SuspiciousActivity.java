package com.securevault.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suspicious_activities")
public class SuspiciousActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private String activityType;

    private String description;

    private LocalDateTime detectedAt;

    private String status;

    public SuspiciousActivity() {
    }

    public SuspiciousActivity(
            String userEmail,
            String activityType,
            String description,
            LocalDateTime detectedAt,
            String status) {

        this.userEmail = userEmail;
        this.activityType = activityType;
        this.description = description;
        this.detectedAt = detectedAt;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getActivityType() {
        return activityType;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}