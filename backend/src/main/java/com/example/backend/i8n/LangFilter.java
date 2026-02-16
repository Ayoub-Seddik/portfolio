package com.example.backend.i8n;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class LangFilter extends OncePerRequestFilter {

    private final RequestLangContext ctx;

    public LangFilter(RequestLangContext ctx) {
        this.ctx = ctx;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            ctx.setLang("en");
        } else {
            String requestedLang = request.getParameter("lang");

            if (requestedLang == null || requestedLang.isBlank()) {
                requestedLang = request.getHeader("Accept-Language");
            }

            ctx.setLang(LangUtil.normalize(requestedLang));
        }

        filterChain.doFilter(request, response);
    }
}
