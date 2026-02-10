package com.example.backend.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @GetMapping("/auth-check")
    public Map<String, Object> authCheck() {
        return Map.of(
                "ok", true,
                "role", "ADMIN"
        );
    }
}
