package com.example.wellnessbackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Fix #13: Simple in-memory rate limiter for sensitive endpoints.
 * Allows a max of 10 requests per minute per IP on:
 *   - POST /api/auth/login
 *   - POST /api/recommendations
 *
 * Uses ConcurrentHashMap for thread safety without external dependencies.
 * For production, replace with Redis-backed Bucket4j or similar.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final long WINDOW_MS = 60_000; // 1 minute

    // Key: IP + endpoint path → [request count, window start timestamp]
    private final Map<String, long[]> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Only apply to the rate-limited endpoints
        boolean isRateLimited =
                ("POST".equals(method) && path.equals("/api/auth/login")) ||
                ("POST".equals(method) && path.equals("/api/recommendations"));

        if (!isRateLimited) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = getClientIp(request);
        String key = ip + ":" + path;
        long now = Instant.now().toEpochMilli();

        requestCounts.compute(key, (k, existing) -> {
            if (existing == null || now - existing[1] > WINDOW_MS) {
                return new long[]{1, now};
            }
            existing[0]++;
            return existing;
        });

        long[] entry = requestCounts.get(key);
        if (entry[0] > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"status\":429,\"message\":\"Too many requests. Please wait a minute before trying again.\"}"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
