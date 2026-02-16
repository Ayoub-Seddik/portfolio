package com.example.backend.i8n;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class DeepLTranslatorClient implements TranslatorClient {

    private final WebClient webClient;
    private final String apiKey;

    public DeepLTranslatorClient(
            WebClient.Builder builder,
            @Value("${deepl.base-url}") String baseUrl,
            @Value("${deepl.api-key}") String apiKey
    ) {
        this.webClient = builder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "DeepL-Auth-Key " + apiKey)
                .build();
        this.apiKey = apiKey;
    }

    @Override
    public String translate(String text, String sourceLang, String targetLang) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("DEEPL_API_KEY is not set");
        }

        // DeepL expects language codes like "EN" and "FR"
        String src = normalizeLang(sourceLang);
        String tgt = normalizeLang(targetLang);

        DeepLTranslateRequest body = new DeepLTranslateRequest(List.of(text), src, tgt);

        DeepLTranslateResponse resp = webClient.post()
                .uri("/v2/translate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(DeepLTranslateResponse.class)
                .block();

        if (resp == null || resp.translations() == null || resp.translations().isEmpty()) {
            throw new RuntimeException("DeepL returned empty response");
        }

        return resp.translations().get(0).text();
    }

    private static String normalizeLang(String lang) {
        if (lang == null || lang.isBlank()) return "EN";
        String l = lang.trim().toUpperCase();
        if (l.startsWith("FR")) return "FR";
        return "EN";
    }

    // --- DTOs for DeepL JSON ---
    public record DeepLTranslateRequest(List<String> text, String source_lang, String target_lang) {}

    public record DeepLTranslateResponse(List<Translation> translations) {
        public record Translation(String detected_source_language, String text) {}
    }
}
