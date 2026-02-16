package com.example.backend.i8n;

public class LangUtil {

    private LangUtil() {}

    public static String normalize(String lang) {
        if (lang == null || lang.isBlank()) return "en";
        String l = lang.toLowerCase();
        if (l.startsWith("fr")) return "fr";
        return "en";
    }
}
