package com.example.backend.translate.presentation;

import com.example.backend.translate.business.TranslateService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TranslateController {

    private final TranslateService translateService;

    public TranslateController(TranslateService translateService) {
        this.translateService = translateService;
    }

    @PostMapping("/translate")
    public TranslateResponse translate(@RequestBody TranslateRequest req) {
        String target = (req.targetLang() == null || req.targetLang().isBlank()) ? "FR" : req.targetLang();
        return new TranslateResponse(translateService.translate(req.text(), target));
    }
}