package com.example.wellnessbackend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Fix #16: OpenAPI configuration for Swagger UI.
 * Adds JWT Bearer token support so authenticated endpoints can be tested directly.
 *
 * Access at: http://localhost:8080/swagger-ui.html
 * Or JSON spec: http://localhost:8080/v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI wellnestOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Wellnest Wellness Marketplace API")
                        .description(
                                "Full-stack wellness marketplace REST API. " +
                                "3 roles: PATIENT, PRACTITIONER, ADMIN. " +
                                "JWT-authenticated. 16 controllers, 40+ endpoints."
                        )
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Maaz Shaikh")
                                .url("https://github.com/Maaz-shaikh20/Wellness-MarketPlace")
                        )
                )
                // Global security: all endpoints require Bearer JWT by default
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter your JWT access token from POST /api/auth/login")
                        )
                );
    }
}
