package com.example.backend.i8n;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;

@Service
public class TranslationService {

    private final TranslatorClient translatorClient;

    private final Cache<String, String> cache = Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(Duration.ofDays(30))
            .build();

    public TranslationService(TranslatorClient translatorClient) {
        this.translatorClient = translatorClient;
    }

    public String t(String text, String lang) {
        if (text == null || text.isBlank()) return text;
        if (lang == null || lang.isBlank() || lang.equalsIgnoreCase("en")) return text;

        String target = lang.toLowerCase().startsWith("fr") ? "fr" : lang.toLowerCase();
        String key = sha256("en|" + target + "|" + text);

        return cache.get(key, k -> translatorClient.translate(text, "en", target));
    }

    // Optional: protect tech terms from getting translated
    public String tTechSafe(String text, String lang) {
        if (text == null) return null;

        String protectedText = text
                .replace("Spring Boot", "[[TECH_SPRING_BOOT]]")
                .replace("React", "[[TECH_REACT]]")
                .replace("Java", "[[TECH_JAVA]]");

        String out = t(protectedText, lang);

        return out
                .replace("[[TECH_SPRING_BOOT]]", "Spring Boot")
                .replace("[[TECH_REACT]]", "React")
                .replace("[[TECH_JAVA]]", "Java");
    }

    private static String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            return Integer.toHexString(input.hashCode());
        }
    }
}
