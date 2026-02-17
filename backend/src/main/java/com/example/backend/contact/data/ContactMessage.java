package com.example.backend.contact.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "contact_messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String contactEmail;

    @Column(nullable = false, length = 40)
    private String contactNumber;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "is_hidden", nullable = false)
    private boolean hidden = false;

    @Column(name = "hidden_at")
    private java.time.Instant hiddenAt;

    @Column(name = "contacted_at")
    private java.time.Instant contactedAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
