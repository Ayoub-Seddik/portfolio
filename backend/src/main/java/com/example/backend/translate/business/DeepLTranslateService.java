package com.example.backend.translate.business;

import com.deepl.api.TextResult;
import com.deepl.api.Translator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DeepLTranslateService implements TranslateService {

    private final Translator translator;

    public DeepLTranslateService(@Value("${DEEPL_AUTH_KEY:}") String authKey) {
        this.translator = (authKey == null || authKey.isBlank()) ? null : new Translator(authKey);
    }

    @Override
    public String translate(String text, String targetLang) {
        if (text == null || text.isBlank()) return text;
        if (translator == null) return text; // no key configured

        try {
            TextResult result = translator.translateText(text, null, targetLang.toUpperCase());
            return result.getText();
        } catch (Exception e) {
            return text;
        }
    }
}