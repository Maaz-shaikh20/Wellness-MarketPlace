package com.example.wellnessbackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Base64;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${gmail.client.id:}")
    private String gmailClientId;

    @Value("${gmail.client.secret:}")
    private String gmailClientSecret;

    @Value("${gmail.refresh.token:}")
    private String gmailRefreshToken;

    @Value("${gmail.sender.email:wellnestmarketplace01@gmail.com}")
    private String gmailSenderEmail;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        // 1. Try Gmail REST API if configured
        if (isGmailApiConfigured()) {
            try {
                log.info("Sending password reset email via Gmail REST API to {}", toEmail);
                String accessToken = getGmailAccessToken();
                
                // Build MIME email message
                Session session = Session.getDefaultInstance(new Properties(), null);
                MimeMessage mimeMessage = new MimeMessage(session);
                mimeMessage.setFrom(new InternetAddress(gmailSenderEmail, "Wellnest"));
                mimeMessage.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(toEmail));
                mimeMessage.setSubject("Reset Your Password - Wellnest");
                
                String htmlContent = "Hello,<br><br>"
                        + "We received a request to reset the password for your Wellnest account.<br>"
                        + "Click the link below to set a new password:<br>"
                        + "<a href=\"" + resetLink + "\">" + resetLink + "</a><br><br>"
                        + "If you did not request a password reset, please ignore this email.<br><br>"
                        + "Best regards,<br>"
                        + "The Wellnest Team";
                        
                mimeMessage.setContent(htmlContent, "text/html; charset=utf-8");

                ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                mimeMessage.writeTo(buffer);
                byte[] rawMessageBytes = buffer.toByteArray();
                String encodedEmail = Base64.getUrlEncoder().withoutPadding().encodeToString(rawMessageBytes);

                Map<String, String> body = Map.of("raw", encodedEmail);
                String jsonBody = objectMapper.writeValueAsString(body);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://gmail.googleapis.com/gmail/v1/users/me/messages/send"))
                        .header("Authorization", "Bearer " + accessToken)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    log.info("📧 Password reset email successfully sent via Gmail REST API to {}. Response: {}", toEmail, response.body());
                    return; // Success, skip other channels
                } else {
                    log.error("❌ Gmail REST API returned error status {}: {}. Trying fallbacks.", response.statusCode(), response.body());
                }
            } catch (Exception e) {
                log.error("❌ Exception while sending email via Gmail REST API: {}. Trying fallbacks.", e.getMessage(), e);
            }
        }

        // 2. Try Resend API if configured
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
                    return; // Success, skip other channels
                } else {
                    log.error("❌ Resend API returned error status {}: {}. Trying SMTP fallback.", response.statusCode(), response.body());
                }
            } catch (Exception e) {
                log.error("❌ Exception while sending email via Resend API: {}. Trying SMTP fallback.", e.getMessage());
            }
        }

        // 3. Try SMTP Fallback
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

    // ============================================================
    // SESSION BOOKING — Confirmation to Patient
    // ============================================================
    public void sendSessionBookingConfirmationToPatient(
            String patientEmail,
            String patientName,
            String therapyName,
            String practitionerName,
            String specialization,
            String clinicAddress,
            String dateTime,
            String notes) {

        String subject = "Your Session is Confirmed – Wellnest ✅";

        String clinicLine = (clinicAddress != null && !clinicAddress.isBlank())
                ? "<p style='margin:8px 0;'><b>📍 Clinic Address:</b> " + clinicAddress + "</p>"
                : "";

        String notesLine = (notes != null && !notes.isBlank())
                ? "<p style='margin:8px 0;'><b>📝 Notes:</b> " + notes + "</p>"
                : "";

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#4CAF50,#2196F3);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#e8f5e9;margin:6px 0 0;'>Your wellness journey continues</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#2e7d32;margin-top:0;'>Session Confirmed! ✅</h2>"
                + "<p style='color:#555;'>Hi <b>" + patientName + "</b>, your session has been booked successfully.</p>"
                + "<div style='background:#fff;border:1px solid #e8f5e9;border-left:4px solid #4CAF50;"
                + "border-radius:8px;padding:20px;margin:20px 0;'>"
                + "<p style='margin:8px 0;'><b>🌿 Therapy:</b> " + therapyName + "</p>"
                + "<p style='margin:8px 0;'><b>👨‍⚕️ Practitioner:</b> " + practitionerName
                + " <span style='color:#777;font-size:13px;'>(" + specialization + ")</span></p>"
                + clinicLine
                + "<p style='margin:8px 0;'><b>🗓 Date &amp; Time:</b> " + dateTime + "</p>"
                + notesLine
                + "</div>"
                + "<p style='color:#777;font-size:13px;'>If you need to cancel, please do so at least 24 hours in advance.</p>"
                + "<p style='color:#555;'>Thank you for choosing <b>Wellnest</b> for your wellness journey! 💚</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(patientEmail, subject, html,
                "SESSION BOOKING CONFIRMATION (PATIENT)",
                "Therapy: " + therapyName + " | Practitioner: " + practitionerName + " | Time: " + dateTime);
    }

    // ============================================================
    // SESSION BOOKING — New Session Notification to Practitioner
    // ============================================================
    public void sendNewSessionNotificationToPractitioner(
            String practitionerEmail,
            String practitionerName,
            String patientName,
            String therapyName,
            String dateTime,
            String notes) {

        String subject = "New Session Booked – Wellnest 📅";

        String notesLine = (notes != null && !notes.isBlank())
                ? "<p style='margin:8px 0;'><b>📝 Patient Notes:</b> " + notes + "</p>"
                : "";

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#1976D2,#42a5f5);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#e3f2fd;margin:6px 0 0;'>Practitioner Dashboard</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#1565C0;margin-top:0;'>You have a new session! 📅</h2>"
                + "<p style='color:#555;'>Hi <b>" + practitionerName + "</b>, a patient has booked a session with you.</p>"
                + "<div style='background:#fff;border:1px solid #bbdefb;border-left:4px solid #1976D2;"
                + "border-radius:8px;padding:20px;margin:20px 0;'>"
                + "<p style='margin:8px 0;'><b>👤 Patient:</b> " + patientName + "</p>"
                + "<p style='margin:8px 0;'><b>🌿 Therapy:</b> " + therapyName + "</p>"
                + "<p style='margin:8px 0;'><b>🗓 Date &amp; Time:</b> " + dateTime + "</p>"
                + notesLine
                + "</div>"
                + "<p style='color:#777;font-size:13px;'>Please accept or reject this session from your dashboard.</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(practitionerEmail, subject, html,
                "NEW SESSION NOTIFICATION (PRACTITIONER)",
                "Patient: " + patientName + " | Therapy: " + therapyName + " | Time: " + dateTime);
    }

    // ============================================================
    // ORDER CONFIRMATION — to Customer
    // ============================================================
    public void sendOrderConfirmationEmail(
            String customerEmail,
            String customerName,
            Long orderId,
            java.util.List<String[]> items,  // each: [name, qty, unitPrice, totalPrice]
            String totalAmount,
            String deliveryAddress,
            String phoneNumber,
            String deliveryMessage) {

        String subject = "Order Confirmed – Wellnest #" + orderId + " 🛒";

        StringBuilder rows = new StringBuilder();
        for (String[] item : items) {
            rows.append("<tr>")
                    .append("<td style='padding:10px;border-bottom:1px solid #f0f0f0;'>").append(item[0]).append("</td>")
                    .append("<td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:center;'>").append(item[1]).append("</td>")
                    .append("<td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;'>₹").append(item[2]).append("</td>")
                    .append("<td style='padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:bold;'>₹").append(item[3]).append("</td>")
                    .append("</tr>");
        }

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#FF6F00,#FFA000);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#fff3e0;margin:6px 0 0;'>Order Confirmation</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#E65100;margin-top:0;'>Order Confirmed! 🎉</h2>"
                + "<p style='color:#555;'>Hi <b>" + customerName + "</b>, thank you for your purchase!</p>"
                + "<p style='color:#777;'>Order ID: <b>#" + orderId + "</b></p>"
                + "<table style='width:100%;border-collapse:collapse;background:#fff;"
                + "border:1px solid #e0e0e0;border-radius:8px;margin:16px 0;overflow:hidden;'>"
                + "<thead>"
                + "<tr style='background:#FF6F00;color:#fff;'>"
                + "<th style='padding:12px;text-align:left;'>Item</th>"
                + "<th style='padding:12px;text-align:center;'>Qty</th>"
                + "<th style='padding:12px;text-align:right;'>Unit Price</th>"
                + "<th style='padding:12px;text-align:right;'>Subtotal</th>"
                + "</tr>"
                + "</thead>"
                + "<tbody>" + rows + "</tbody>"
                + "<tfoot>"
                + "<tr style='background:#fff3e0;'>"
                + "<td colspan='3' style='padding:12px;font-weight:bold;text-align:right;'>Total</td>"
                + "<td style='padding:12px;font-weight:bold;text-align:right;color:#E65100;font-size:16px;'>₹" + totalAmount + "</td>"
                + "</tr>"
                + "</tfoot>"
                + "</table>"
                + "<div style='background:#fff;border:1px solid #ffe0b2;border-left:4px solid #FF6F00;"
                + "border-radius:8px;padding:20px;margin:16px 0;'>"
                + "<p style='margin:6px 0;'><b>📦 Deliver to:</b> " + deliveryAddress + "</p>"
                + "<p style='margin:6px 0;'><b>📞 Contact:</b> " + phoneNumber + "</p>"
                + "<p style='margin:6px 0;color:#777;font-size:13px;'>" + deliveryMessage + "</p>"
                + "</div>"
                + "<p style='color:#555;'>Thank you for shopping at <b>Wellnest</b>! 💚</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(customerEmail, subject, html,
                "ORDER CONFIRMATION",
                "Order #" + orderId + " | Total: ₹" + totalAmount + " | Deliver to: " + deliveryAddress);
    }

    // ============================================================
    // Internal: shared send-with-fallback logic
    // ============================================================
    private void sendWithFallback(String toEmail, String subject, String htmlContent,
            String logLabel, String consoleSummary) {

        // 1. Try Gmail REST API
        if (isGmailApiConfigured()) {
            try {
                log.info("Sending [{}] via Gmail REST API to {}", logLabel, toEmail);
                String accessToken = getGmailAccessToken();

                Session session = Session.getDefaultInstance(new Properties(), null);
                MimeMessage mimeMessage = new MimeMessage(session);
                mimeMessage.setFrom(new InternetAddress(gmailSenderEmail, "Wellnest"));
                mimeMessage.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(toEmail));
                mimeMessage.setSubject(subject);
                mimeMessage.setContent(htmlContent, "text/html; charset=utf-8");

                ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                mimeMessage.writeTo(buffer);
                String encodedEmail = Base64.getUrlEncoder().withoutPadding()
                        .encodeToString(buffer.toByteArray());

                Map<String, String> body = Map.of("raw", encodedEmail);
                String jsonBody = objectMapper.writeValueAsString(body);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://gmail.googleapis.com/gmail/v1/users/me/messages/send"))
                        .header("Authorization", "Bearer " + accessToken)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    log.info("📧 [{}] sent via Gmail REST API to {}", logLabel, toEmail);
                    return;
                } else {
                    log.error("❌ Gmail REST API error {}: {}", response.statusCode(), response.body());
                }
            } catch (Exception e) {
                log.error("❌ Gmail REST API exception for [{}]: {}", logLabel, e.getMessage());
            }
        }

        // 2. Try Resend API
        if (resendApiKey != null && !resendApiKey.trim().isEmpty()) {
            try {
                log.info("Sending [{}] via Resend API to {}", logLabel, toEmail);

                Map<String, Object> body = Map.of(
                        "from", "Wellnest <onboarding@resend.dev>",
                        "to", List.of(toEmail),
                        "subject", subject,
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
                    log.info("📧 [{}] sent via Resend API to {}", logLabel, toEmail);
                    return;
                } else {
                    log.error("❌ Resend API error {}: {}", response.statusCode(), response.body());
                }
            } catch (Exception e) {
                log.error("❌ Resend API exception for [{}]: {}", logLabel, e.getMessage());
            }
        }

        // 3. Try SMTP
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText("Please view this email in an HTML-compatible client.\n\n" + consoleSummary);
            mailSender.send(message);
            log.info("📧 [{}] sent via SMTP to {}", logLabel, toEmail);
        } catch (Exception e) {
            log.error("❌ SMTP failed for [{}] to {}: {}. Using console fallback.", logLabel, toEmail, e.getMessage());
            System.out.println("\n==================================================");
            System.out.println("📬 [DEV FALLBACK] " + logLabel);
            System.out.println("Recipient: " + toEmail);
            System.out.println(consoleSummary);
            System.out.println("==================================================\n");
        }
    }

    private boolean isGmailApiConfigured() {
        return gmailClientId != null && !gmailClientId.trim().isEmpty()
                && gmailClientSecret != null && !gmailClientSecret.trim().isEmpty()
                && gmailRefreshToken != null && !gmailRefreshToken.trim().isEmpty();
    }

    private String getGmailAccessToken() throws Exception {
        String payload = "client_id=" + gmailClientId
                + "&client_secret=" + gmailClientSecret
                + "&refresh_token=" + gmailRefreshToken
                + "&grant_type=refresh_token";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://oauth2.googleapis.com/token"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            Map<String, Object> map = objectMapper.readValue(response.body(), Map.class);
            return (String) map.get("access_token");
        } else {
            throw new RuntimeException("Failed to get Gmail access token: " + response.body());
        }
    }

    // ============================================================
    // SESSION ACCEPTED — Notification to Patient
    // ============================================================
    public void sendSessionAcceptedToPatient(
            String patientEmail,
            String patientName,
            String therapyName,
            String practitionerName,
            String specialization,
            String clinicAddress,
            String dateTime) {

        String subject = "Session Accepted – Wellnest 🎉";

        String clinicLine = (clinicAddress != null && !clinicAddress.isBlank())
                ? "<p style='margin:8px 0;'><b>📍 Clinic Address:</b> " + clinicAddress + "</p>"
                : "";

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#00897B,#26C6DA);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#e0f2f1;margin:6px 0 0;'>Great news from your practitioner!</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#00695C;margin-top:0;'>Your session has been accepted! 🎉</h2>"
                + "<p style='color:#555;'>Hi <b>" + patientName + "</b>, your practitioner has confirmed your session.</p>"
                + "<div style='background:#fff;border:1px solid #b2dfdb;border-left:4px solid #00897B;"
                + "border-radius:8px;padding:20px;margin:20px 0;'>"
                + "<p style='margin:8px 0;'><b>🌿 Therapy:</b> " + therapyName + "</p>"
                + "<p style='margin:8px 0;'><b>👨‍⚕️ Practitioner:</b> " + practitionerName
                + " <span style='color:#777;font-size:13px;'>(" + specialization + ")</span></p>"
                + clinicLine
                + "<p style='margin:8px 0;'><b>🗓 Date &amp; Time:</b> " + dateTime + "</p>"
                + "</div>"
                + "<p style='color:#777;font-size:13px;'>Please arrive 10 minutes before your scheduled time.</p>"
                + "<p style='color:#555;'>See you soon! 💚</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(patientEmail, subject, html,
                "SESSION ACCEPTED (PATIENT)",
                "Therapy: " + therapyName + " | Practitioner: " + practitionerName + " | Time: " + dateTime);
    }

    // ============================================================
    // SESSION REJECTED — Notification to Patient
    // ============================================================
    public void sendSessionRejectedToPatient(
            String patientEmail,
            String patientName,
            String therapyName,
            String practitionerName,
            String dateTime,
            String reason) {

        String subject = "Session Update – Wellnest";

        String reasonLine = (reason != null && !reason.isBlank())
                ? "<p style='margin:8px 0;'><b>📋 Reason:</b> " + reason + "</p>"
                : "";

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#757575,#9E9E9E);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#f5f5f5;margin:6px 0 0;'>Session Update</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#424242;margin-top:0;'>Session Could Not Be Confirmed</h2>"
                + "<p style='color:#555;'>Hi <b>" + patientName + "</b>, unfortunately your practitioner was unable to accept the following session.</p>"
                + "<div style='background:#fff;border:1px solid #e0e0e0;border-left:4px solid #9E9E9E;"
                + "border-radius:8px;padding:20px;margin:20px 0;'>"
                + "<p style='margin:8px 0;'><b>🌿 Therapy:</b> " + therapyName + "</p>"
                + "<p style='margin:8px 0;'><b>👨‍⚕️ Practitioner:</b> " + practitionerName + "</p>"
                + "<p style='margin:8px 0;'><b>🗓 Date &amp; Time:</b> " + dateTime + "</p>"
                + reasonLine
                + "</div>"
                + "<p style='color:#555;'>You can browse other available practitioners and book a new session anytime. 💚</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(patientEmail, subject, html,
                "SESSION REJECTED (PATIENT)",
                "Therapy: " + therapyName + " | Practitioner: " + practitionerName + " | Time: " + dateTime);
    }

    // ============================================================
    // SESSION CANCELLED — Notification to Patient
    // ============================================================
    public void sendSessionCancelledToPatient(
            String patientEmail,
            String patientName,
            String therapyName,
            String practitionerName,
            String dateTime) {

        String subject = "Session Cancelled – Wellnest";

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#E53935,#EF9A9A);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#ffebee;margin:6px 0 0;'>Session Cancellation</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#B71C1C;margin-top:0;'>Your session has been cancelled</h2>"
                + "<p style='color:#555;'>Hi <b>" + patientName + "</b>, the following session has been cancelled.</p>"
                + "<div style='background:#fff;border:1px solid #ffcdd2;border-left:4px solid #E53935;"
                + "border-radius:8px;padding:20px;margin:20px 0;'>"
                + "<p style='margin:8px 0;'><b>🌿 Therapy:</b> " + therapyName + "</p>"
                + "<p style='margin:8px 0;'><b>👨‍⚕️ Practitioner:</b> " + practitionerName + "</p>"
                + "<p style='margin:8px 0;'><b>🗓 Date &amp; Time:</b> " + dateTime + "</p>"
                + "</div>"
                + "<p style='color:#555;'>You can book a new session anytime from your dashboard. 💚</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(patientEmail, subject, html,
                "SESSION CANCELLED (PATIENT)",
                "Therapy: " + therapyName + " | Practitioner: " + practitionerName + " | Time: " + dateTime);
    }

    // ============================================================
    // SESSION CANCELLED — Notification to Practitioner
    // ============================================================
    public void sendSessionCancelledToPractitioner(
            String practitionerEmail,
            String practitionerName,
            String patientName,
            String therapyName,
            String dateTime,
            String reason) {

        String subject = "Session Cancelled – Wellnest";

        String reasonLine = (reason != null && !reason.isBlank())
                ? "<p style='margin:8px 0;'><b>📋 Reason given by patient:</b> " + reason + "</p>"
                : "";

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#E53935,#EF9A9A);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#ffebee;margin:6px 0 0;'>Practitioner Dashboard</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#B71C1C;margin-top:0;'>A session has been cancelled</h2>"
                + "<p style='color:#555;'>Hi <b>" + practitionerName + "</b>, a patient has cancelled their session.</p>"
                + "<div style='background:#fff;border:1px solid #ffcdd2;border-left:4px solid #E53935;"
                + "border-radius:8px;padding:20px;margin:20px 0;'>"
                + "<p style='margin:8px 0;'><b>👤 Patient:</b> " + patientName + "</p>"
                + "<p style='margin:8px 0;'><b>🌿 Therapy:</b> " + therapyName + "</p>"
                + "<p style='margin:8px 0;'><b>🗓 Date &amp; Time:</b> " + dateTime + "</p>"
                + reasonLine
                + "</div>"
                + "<p style='color:#555;'>The slot is now available for other bookings. 💚</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(practitionerEmail, subject, html,
                "SESSION CANCELLED (PRACTITIONER)",
                "Patient: " + patientName + " | Therapy: " + therapyName + " | Time: " + dateTime);
    }

    // ============================================================
    // SESSION COMPLETED — Notification to Patient
    // ============================================================
    public void sendSessionCompletedToPatient(
            String patientEmail,
            String patientName,
            String therapyName,
            String practitionerName,
            String dateTime) {

        String subject = "Session Completed – Leave a Review! ⭐ Wellnest";

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#7B1FA2,#BA68C8);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#f3e5f5;margin:6px 0 0;'>Session Summary</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#6A1B9A;margin-top:0;'>Your session is complete! ✨</h2>"
                + "<p style='color:#555;'>Hi <b>" + patientName + "</b>, your wellness session has been marked as completed.</p>"
                + "<div style='background:#fff;border:1px solid #e1bee7;border-left:4px solid #7B1FA2;"
                + "border-radius:8px;padding:20px;margin:20px 0;'>"
                + "<p style='margin:8px 0;'><b>🌿 Therapy:</b> " + therapyName + "</p>"
                + "<p style='margin:8px 0;'><b>👨‍⚕️ Practitioner:</b> " + practitionerName + "</p>"
                + "<p style='margin:8px 0;'><b>🗓 Session Date:</b> " + dateTime + "</p>"
                + "</div>"
                + "<p style='color:#555;'>How was your experience? <b>Leave a review</b> on the Wellnest app to help others find the right practitioner. ⭐⭐⭐⭐⭐</p>"
                + "<p style='color:#555;'>Thank you for choosing <b>Wellnest</b>! 💚</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(patientEmail, subject, html,
                "SESSION COMPLETED (PATIENT)",
                "Therapy: " + therapyName + " | Practitioner: " + practitionerName + " | Time: " + dateTime);
    }

    // ============================================================
    // SESSION COMPLETED — Notification to Practitioner
    // ============================================================
    public void sendSessionCompletedToPractitioner(
            String practitionerEmail,
            String practitionerName,
            String patientName,
            String therapyName,
            String dateTime) {

        String subject = "Session Completed – Wellnest ✅";

        String html = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;"
                + "border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;'>"
                + "<div style='background:linear-gradient(135deg,#7B1FA2,#BA68C8);padding:30px;text-align:center;'>"
                + "<h1 style='color:#fff;margin:0;font-size:24px;'>Wellnest 🌿</h1>"
                + "<p style='color:#f3e5f5;margin:6px 0 0;'>Practitioner Dashboard</p>"
                + "</div>"
                + "<div style='padding:32px;background:#fafafa;'>"
                + "<h2 style='color:#6A1B9A;margin-top:0;'>Session marked as complete ✅</h2>"
                + "<p style='color:#555;'>Hi <b>" + practitionerName + "</b>, the following session has been completed.</p>"
                + "<div style='background:#fff;border:1px solid #e1bee7;border-left:4px solid #7B1FA2;"
                + "border-radius:8px;padding:20px;margin:20px 0;'>"
                + "<p style='margin:8px 0;'><b>👤 Patient:</b> " + patientName + "</p>"
                + "<p style='margin:8px 0;'><b>🌿 Therapy:</b> " + therapyName + "</p>"
                + "<p style='margin:8px 0;'><b>🗓 Session Date:</b> " + dateTime + "</p>"
                + "</div>"
                + "<p style='color:#555;'>Great work! Your session record has been updated. 💚</p>"
                + "</div>"
                + "<div style='background:#f5f5f5;padding:16px;text-align:center;"
                + "color:#aaa;font-size:12px;border-top:1px solid #e0e0e0;'>"
                + "Wellnest Marketplace · Alternative Therapies"
                + "</div>"
                + "</div>";

        sendWithFallback(practitionerEmail, subject, html,
                "SESSION COMPLETED (PRACTITIONER)",
                "Patient: " + patientName + " | Therapy: " + therapyName + " | Time: " + dateTime);
    }
}

