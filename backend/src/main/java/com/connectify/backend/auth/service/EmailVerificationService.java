package com.connectify.backend.auth.service;

import com.connectify.backend.user.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailVerificationService {

    private final JavaMailSender mailSender;
    private final Environment environment;

    public void sendVerificationEmail(User user, String token) {
        String subject = "Verify your Connectify account";
        String html = verificationTemplate(user, token);
        sendHtmlEmail(user.getEmail(), subject, html, "verification");
    }

    public void sendLoginOtp(User user, String otp) {
        String subject = "Your Connectify login OTP";
        String html = otpTemplate(
                "Login OTP",
                "Use this code to complete your login.",
                otp
        );
        sendHtmlEmail(user.getEmail(), subject, html, "login-otp");
    }

    public void sendPasswordResetOtp(User user, String otp) {
        String subject = "Reset your Connectify password";
        String html = otpTemplate(
                "Password Reset OTP",
                "Use this code to continue resetting your password.",
                otp
        );
        sendHtmlEmail(user.getEmail(), subject, html, "reset-otp");
    }

    private void sendHtmlEmail(String to, String subject, String html, String templateName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    true,
                    StandardCharsets.UTF_8.name()
            );

            helper.setTo(to);
            helper.setFrom(environment.getProperty("MAIL_FROM", environment.getProperty("SMTP_USERNAME")));
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);
            log.info("Sent {} email to {}", templateName, to);
        } catch (MessagingException ex) {
            log.error("Failed to send {} email to {}", templateName, to, ex);
            throw new IllegalStateException("Failed to send email");
        }
    }

    private String verificationTemplate(User user, String token) {
        String appName = environment.getProperty("APP_NAME", "Connectify");
        return """
                <html>
                  <body style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
                    <h2>Welcome to %s</h2>
                    <p>Hi %s,</p>
                    <p>Use the verification code below to verify your email address:</p>
                    <div style="font-size:24px;font-weight:700;letter-spacing:4px;padding:16px 20px;background:#f4f4f5;display:inline-block;border-radius:8px;">
                      %s
                    </div>
                    <p>If you did not create this account, you can ignore this email.</p>
                  </body>
                </html>
                """.formatted(appName, user.getFirstName(), token);
    }

    private String otpTemplate(String heading, String description, String otp) {
        String appName = environment.getProperty("APP_NAME", "Connectify");
        return """
                <html>
                  <body style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
                    <h2>%s - %s</h2>
                    <p>%s</p>
                    <div style="font-size:24px;font-weight:700;letter-spacing:4px;padding:16px 20px;background:#f4f4f5;display:inline-block;border-radius:8px;">
                      %s
                    </div>
                    <p>This code expires soon.</p>
                  </body>
                </html>
                """.formatted(appName, heading, description, otp);
    }
}
