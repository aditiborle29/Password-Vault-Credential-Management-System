package com.securevault.repository;

import com.securevault.entity.SuspiciousActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity> findByUserEmailOrderByDetectedAtDesc(
            String userEmail);

    List<SuspiciousActivity> findAllByOrderByDetectedAtDesc();
}