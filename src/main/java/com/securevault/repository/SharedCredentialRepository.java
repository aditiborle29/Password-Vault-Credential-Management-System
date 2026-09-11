package com.securevault.repository;

import com.securevault.entity.SharedCredential;
import com.securevault.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SharedCredentialRepository
                extends JpaRepository<SharedCredential, Long> {

        List<SharedCredential> findBySharedWith(User user);

        List<SharedCredential> findByOwner(User owner);

        Optional<SharedCredential> findByCredentialIdAndSharedWith(
                        Long credentialId,
                        User sharedWith);

        boolean existsByCredentialIdAndSharedWith(
                        Long credentialId,
                        User sharedWith);

        // Delete all sharing records related to a credential
        void deleteByCredentialId(Long credentialId);
}