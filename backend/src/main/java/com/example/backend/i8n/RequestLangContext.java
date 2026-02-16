package com.example.backend.i8n;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class RequestLangContext {

    private String lang = "en"; // default

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = (lang == null || lang.isBlank()) ? "en" : lang;
    }
}
