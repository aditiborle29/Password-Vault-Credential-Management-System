package com.securevault.repository;

import com.securevault.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LoginAttemptRepository
                extends JpaRepository<LoginAttempt, Long> {

        long countByEmailAndSuccessFalseAndTimestampAfter(
                        String email,
                        LocalDateTime time);

        long countByIpAddressAndSuccessFalseAndTimestampAfter(
                        String ipAddress,
                        LocalDateTime time);

        List<LoginAttempt> findTop50ByOrderByTimestampDesc();

        List<LoginAttempt> findByEmailOrderByTimestampDesc(
                        String email);

        // USER-SPECIFIC - latest 50 attempts
        List<LoginAttempt> findTop50ByEmailOrderByTimestampDesc(
                        String email);
}