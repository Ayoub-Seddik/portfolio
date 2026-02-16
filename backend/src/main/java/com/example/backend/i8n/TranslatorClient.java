package com.example.backend.i8n;

public interface TranslatorClient {
    String translate(String text, String sourceLang, String targetLang);
}
