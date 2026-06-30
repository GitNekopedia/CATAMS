package com.usyd.catams.application.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public void sendMail(String to, String subject, String text) {
        if (fromAddress == null || fromAddress.isBlank()) {
            throw new IllegalStateException("spring.mail.username is not configured");
        }

        long start = System.currentTimeMillis();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);

            mailSender.send(message);
            log.info("Mail sent to {} in {} ms", to, System.currentTimeMillis() - start);
        } catch (MailException e) {
            log.error("Mail sending failed to {}: {}", to, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected mail sending failure to {}: {}", to, e.getMessage(), e);
            throw new IllegalStateException("Unexpected mail sending failure", e);
        }
    }
}
