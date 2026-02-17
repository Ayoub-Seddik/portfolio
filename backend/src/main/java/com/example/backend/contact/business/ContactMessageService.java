package com.example.backend.contact.business;

import com.example.backend.contact.data.ContactMessage;
import com.example.backend.contact.data.ContactMessageRepository;
import com.example.backend.contact.presentation.ContactMessagesRequest;
import com.example.backend.contact.presentation.ContactMessagesResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repository;

    public List<ContactMessagesResponse> getAllMessagesByNewest(boolean hidden) {

        return repository.findAllByHiddenOrderByCreatedAtDesc(hidden).stream()
                .map(cm -> new ContactMessagesResponse(
                        cm.getId(),
                        cm.getFullName(),
                        cm.getContactEmail(),
                        cm.getContactNumber(),
                        cm.getReason(),
                        cm.getCreatedAt()
                ))
                .toList();
    }

    public void create(ContactMessagesRequest request){
        ContactMessage cm = new ContactMessage();
        cm.setFullName(request.fullName().trim());
        cm.setContactEmail(request.contactEmail().trim());
        cm.setContactNumber(request.contactNumber().trim());
        cm.setReason(request.reason().trim());
        repository.save(cm);
    }

    public void hideMessage(Long id) {
        ContactMessage m = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!m.isHidden()) {
            m.setHidden(true);
            m.setHiddenAt(java.time.Instant.now());
            m.setContactedAt(java.time.Instant.now());
            repository.save(m);
        }
    }

    public void unhideMessage(Long id) {
        ContactMessage m = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (m.isHidden()) {
            m.setHidden(false);
            m.setHiddenAt(null);
            // keep contactedAt as history (or set to null if you prefer)
            repository.save(m);
        }
    }


    public void deleteIfHidden(Long id) {
        ContactMessage m = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!m.isHidden()) {
            throw new RuntimeException("You can only delete messages after they are hidden.");
        }

        repository.delete(m);
    }
}
