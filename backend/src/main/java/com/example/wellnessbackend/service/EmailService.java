package com.example.wellnessbackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
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
