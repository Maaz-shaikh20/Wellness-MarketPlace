package com.example.wellnessbackend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // ======================
                        // AUTH
                        // ======================
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/refresh-token"
                        ).permitAll()

                        // ======================
                        // FAKE PAYMENT GATEWAY (NO TOKEN)
                        // ======================
                        .requestMatchers(
                                "/api/fake-gateway/**"
                        ).permitAll()

                        // ======================
                        // ORDERS & PAYMENTS (USER)
                        // ======================
                        .requestMatchers(HttpMethod.POST,
                                "/api/orders",
                                "/api/payments/initiate"
                        ).hasRole("PATIENT")

                        .requestMatchers(HttpMethod.GET,
                                "/api/payments/status/**"
                        ).hasRole("PATIENT")

                        // ======================
                        // FORUM (Q & A)
                        // ======================
                        .requestMatchers(HttpMethod.POST,
                                "/api/forum/ask"
                        ).hasRole("PATIENT")

                        .requestMatchers(HttpMethod.GET,
                                "/api/forum/unanswered"
                        ).hasAnyRole("PRACTITIONER","PATIENT")

                        .requestMatchers(HttpMethod.POST,
                                "/api/forum/answer"
                        ).hasRole("PRACTITIONER")

                        .requestMatchers(HttpMethod.GET,
                                "/api/forum/answers/**"
                        ).hasAnyRole("PRACTITIONER","PATIENT")

                        // ======================
                        // PRODUCT REVIEWS
                        // ======================
                        .requestMatchers(HttpMethod.POST,
                                "/api/product-reviews"
                        ).hasAnyRole("PATIENT", "ADMIN")

                        .requestMatchers(HttpMethod.GET,
                                "/api/product-reviews/**"
                        ).permitAll()

                        // ======================
                        // PRACTITIONERS (PUBLIC)
                        // ======================
                        .requestMatchers(HttpMethod.GET,
                                "/api/practitioners/**"
                        ).permitAll()

                        // ======================
                        // PRODUCTS
                        // ======================
                        .requestMatchers(HttpMethod.GET,
                                "/api/products/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.POST,
                                "/api/products"
                        ).hasAnyRole("ADMIN", "PRACTITIONER")

                        .requestMatchers(HttpMethod.PUT,
                                "/api/products/**"
                        ).hasAnyRole("ADMIN","PRACTITIONER")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/products/**"
                        ).hasAnyRole("ADMIN", "PRACTITIONER")

                        // ======================
                        // RECOMMENDATIONS
                        // ======================
                        .requestMatchers(HttpMethod.POST,
                                "/api/recommendations"
                        ).hasRole("PATIENT")

                        .requestMatchers(HttpMethod.GET,
                                "/api/recommendations/user/**"
                        ).hasAnyRole("PATIENT", "ADMIN")

                        // ======================
                        // NOTIFICATIONS
                        // ======================
                        .requestMatchers(HttpMethod.POST,
                                "/api/notifications"
                        ).hasRole("PATIENT")

                        .requestMatchers(HttpMethod.GET,
                                "/api/notifications/**"
                        ).hasAnyRole("PATIENT", "ADMIN")

                        // ======================
                        // ADMIN
                        // ======================
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // ======================
                        // COMMON / PUBLIC
                        // ======================
                        .requestMatchers(
                                "/error",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/external/**"
                        ).permitAll()

                        // ======================
                        // EVERYTHING ELSE
                        // ======================
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}