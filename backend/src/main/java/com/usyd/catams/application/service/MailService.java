package com.usyd.catams.application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async  // 异步发送，防止阻塞主线程
    public void sendMail(String to, String subject, String text) {
        try {
            long start = System.currentTimeMillis();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("1842640660@qq.com"); // 发件人
            message.setTo(to);                         // 收件人
            message.setSubject(subject);               // 标题
            message.setText(text);                     // 内容
            mailSender.send(message);
            long end = System.currentTimeMillis();
            System.out.println("✅ Mail sent to " + to);
            System.out.println("📨 Mail sent in " + (end - start) + " ms");
        } catch (Exception e) {
            System.err.println("❌ Mail sending failed: " + e.getMessage());
        }
    }
}
