package com.securevault.repository;

import com.securevault.entity.SecurityAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SecurityAlertRepository
                extends JpaRepository<SecurityAlert, Long> {

        List<SecurityAlert> findTop50ByOrderByTimestampDesc();

        List<SecurityAlert> findByEmailOrderByTimestampDesc(
                        String email);

        boolean existsByEmailAndAlertTypeAndResolvedFalse(
                        String email,
                        String alertType);
}