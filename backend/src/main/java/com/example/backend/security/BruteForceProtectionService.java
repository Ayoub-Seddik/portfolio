package com.example.backend.security;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BruteForceProtectionService {

    // Tune these
    private static final int MAX_FAILED_ATTEMPTS = 8;                 // lock after this many
    private static final Duration LOCK_DURATION = Duration.ofMinutes(15);

    // Progressive delay: 0ms, 300ms, 600ms, ... capped
    private static final long DELAY_STEP_MS = 300;
    private static final long MAX_DELAY_MS = 2000;

    private static class State {
        int failures;
        long lockUntilEpochMs;
        long lastFailureEpochMs;
    }

    private final Map<String, State> states = new ConcurrentHashMap<>();

    public boolean isLocked(String key) {
        State s = states.get(key);
        if (s == null) return false;
        long now = System.currentTimeMillis();
        if (s.lockUntilEpochMs <= now) return false;
        return true;
    }

    public long lockRemainingMs(String key) {
        State s = states.get(key);
        if (s == null) return 0;
        long now = System.currentTimeMillis();
        return Math.max(0, s.lockUntilEpochMs - now);
    }

    public long failureDelayMs(String key) {
        State s = states.get(key);
        if (s == null) return 0;
        long delay = (long) s.failures * DELAY_STEP_MS;
        return Math.min(delay, MAX_DELAY_MS);
    }

    public void onFailure(String key) {
        long now = System.currentTimeMillis();
        State s = states.computeIfAbsent(key, k -> new State());
        s.failures++;
        s.lastFailureEpochMs = now;

        if (s.failures >= MAX_FAILED_ATTEMPTS) {
            s.lockUntilEpochMs = now + LOCK_DURATION.toMillis();
        }
    }

    public void onSuccess(String key) {
        states.remove(key); // reset on success
    }
}