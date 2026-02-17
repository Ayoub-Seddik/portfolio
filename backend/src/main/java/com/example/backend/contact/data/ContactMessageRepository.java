package com.example.backend.contact.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByHiddenOrderByCreatedAtDesc(boolean hidden);

}
