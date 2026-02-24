package com.example.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class AdminRateLimitFilter extends OncePerRequestFilter {

    // 20 requests per minute per IP (tune)
    private static final int LIMIT = 10;
    private static final long WINDOW_MS = 60_000;

    private static class Window {
        long windowStartMs;
        int count;
    }

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (!path.startsWith("/api/admin/")) return true;
        return HttpMethod.OPTIONS.matches(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String key = clientIp(request);
        long now = Instant.now().toEpochMilli();

        Window w = windows.computeIfAbsent(key, k -> {
            Window nw = new Window();
            nw.windowStartMs = now;
            nw.count = 0;
            return nw;
        });

        synchronized (w) {
            if (now - w.windowStartMs >= WINDOW_MS) {
                w.windowStartMs = now;
                w.count = 0;
            }
            w.count++;
            if (w.count > LIMIT) {
                long retryAfterMs = WINDOW_MS - (now - w.windowStartMs);
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Rate limit exceeded\",\"retryAfterMs\":" + retryAfterMs + "}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private static String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return request.getRemoteAddr();
    }
}