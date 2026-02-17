package com.example.backend.admin;

import com.example.backend.contact.business.ContactMessageService;
import com.example.backend.contact.presentation.ContactMessagesResponse;
import jakarta.servlet.ServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contact-messages")
@RequiredArgsConstructor
public class AdminContactMessageController {

    public final ContactMessageService contactMessageService;

    @GetMapping()
    public ResponseEntity<List<ContactMessagesResponse>> getAllContactMessages(
            @RequestParam(defaultValue = "false") boolean hidden
    ) {
        return ResponseEntity.ok(contactMessageService.getAllMessagesByNewest(hidden));
    }

    @PatchMapping("/{id}/hide")
    public ResponseEntity<Void> hide(@PathVariable Long id) {
        contactMessageService.hideMessage(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/unhide")
    public ResponseEntity<Void> unhide(@PathVariable Long id) {
        contactMessageService.unhideMessage(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactMessageService.deleteIfHidden(id);
        return ResponseEntity.noContent().build();
    }
}
