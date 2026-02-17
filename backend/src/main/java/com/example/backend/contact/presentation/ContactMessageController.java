package com.example.backend.contact.presentation;

import com.example.backend.contact.business.ContactMessageService;
import com.example.backend.contact.data.ContactMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    @PostMapping()
    public ResponseEntity<Void> createMessage(
            @Valid @RequestBody ContactMessagesRequest request) {
        contactMessageService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
