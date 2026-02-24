package com.example.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AdminBruteForceFilter extends OncePerRequestFilter {

    private final BruteForceProtectionService protection;

    public AdminBruteForceFilter(BruteForceProtectionService protection) {
        this.protection = protection;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Only protect admin API
        if (!path.startsWith("/api/admin/")) return true;

        // Allow OPTIONS preflight
        return HttpMethod.OPTIONS.matches(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String key = clientIp(request);

        // If locked, block immediately
        if (protection.isLocked(key)) {
            long remainingMs = protection.lockRemainingMs(key);
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many failed attempts. Try again later.\",\"retryAfterMs\":" + remainingMs + "}");
            return;
        }

        // Add delay based on past failures (slows brute force)
        long delayMs = protection.failureDelayMs(key);
        if (delayMs > 0) {
            try { Thread.sleep(delayMs); } catch (InterruptedException ignored) {}
        }

        filterChain.doFilter(request, response);
    }

    private static String clientIp(HttpServletRequest request) {
        // DO / proxies: trust X-Forwarded-For (first IP)
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}