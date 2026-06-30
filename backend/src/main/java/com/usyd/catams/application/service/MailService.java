package com.usyd.catams.application.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
    
            // 创建 MimeMessage 对象
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    
            helper.setFrom("1842640660@qq.com"); // 发件人
            helper.setTo(to);                   // 收件人
            helper.setSubject(subject);         // 标题
            helper.setText(text, true);         // 内容，第二个参数 true 表示启用 HTML
    
            mailSender.send(message);
            long end = System.currentTimeMillis();
            System.out.println("✅ Mail sent to " + to);
            System.out.println("📨 Mail sent in " + (end - start) + " ms");
        } catch (Exception e) {
            System.err.println("❌ Mail sending failed: " + e.getMessage());
        }
    }
}