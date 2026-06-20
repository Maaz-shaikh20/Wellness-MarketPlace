package com.example.wellnessbackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${resend.api.key:}")
    private String resendApiKey;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        // Try Resend API first if key is configured
        if (resendApiKey != null && !resendApiKey.trim().isEmpty()) {
            try {
                log.info("Sending password reset email via Resend API to {}", toEmail);
                
                String htmlContent = "Hello,<br><br>"
                        + "We received a request to reset the password for your Wellnest account.<br>"
                        + "Click the link below to set a new password:<br>"
                        + "<a href=\"" + resetLink + "\">" + resetLink + "</a><br><br>"
                        + "If you did not request a password reset, please ignore this email.<br><br>"
                        + "Best regards,<br>"
                        + "The Wellnest Team";

                Map<String, Object> body = Map.of(
                        "from", "Wellnest <onboarding@resend.dev>",
                        "to", List.of(toEmail),
                        "subject", "Reset Your Password - Wellnest",
                        "html", htmlContent
                );

                String jsonBody = objectMapper.writeValueAsString(body);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.resend.com/emails"))
                        .header("Authorization", "Bearer " + resendApiKey)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    log.info("📧 Password reset email successfully sent via Resend API to {}. Response: {}", toEmail, response.body());
                    return; // Success, skip fallback
                } else {
                    log.error("❌ Resend API returned error status {}: {}. Trying SMTP fallback.", response.statusCode(), response.body());
                }
            } catch (Exception e) {
                log.error("❌ Exception while sending email via Resend API: {}. Trying SMTP fallback.", e.getMessage());
            }
        }

        // SMTP Fallback
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Reset Your Password - Wellnest");
            message.setText("Hello,\n\n"
                    + "We received a request to reset the password for your Wellnest account.\n"
                    + "Click the link below to set a new password:\n"
                    + resetLink + "\n\n"
                    + "If you did not request a password reset, please ignore this email.\n\n"
                    + "Best regards,\n"
                    + "The Wellnest Team");
            
            mailSender.send(message);
            log.info("📧 Password reset email successfully sent to {}. Link: {}", toEmail, resetLink);
        } catch (Exception e) {
            log.error("❌ Failed to send email via SMTP to {}: {}. Falling back to console logging.", toEmail, e.getMessage());
            // Safe fallback console print
            System.out.println("\n==================================================");
            System.out.println("📬 [DEV FALLBACK] PASSWORD RESET REQUEST");
            System.out.println("Recipient: " + toEmail);
            System.out.println("Reset Link: " + resetLink);
            System.out.println("==================================================\n");
        }
    }
}
