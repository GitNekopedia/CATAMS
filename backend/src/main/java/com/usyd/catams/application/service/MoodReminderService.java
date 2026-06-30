package com.usyd.catams.application.service;

import com.usyd.catams.adapter.persistence.MoodRecordMapper;
import com.usyd.catams.infrastructure.config.ReminderAccountConfig;
import com.usyd.catams.adapter.persistence.UserMapper;
import com.usyd.catams.infrastructure.messaging.MailQueueProducer;
import com.usyd.catams.infrastructure.messaging.dto.MailMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class MoodReminderService {

    private final ReminderAccountConfig reminderConfig;
    private final UserMapper userMapper;
    private final MoodRecordMapper moodMapper;
    private final MailQueueProducer mailQueueProducer;

    /** 检查配置中的账号，并发送心情提醒邮件 */
    public void checkAndSendReminders() {
        String nowUtc = Instant.now().toString();
        log.info("当前 UTC 时间：{}", nowUtc);
        LocalDate today = LocalDate.now();

        for (String email : reminderConfig.getAccounts()) {
            var user = userMapper.findByEmail(email);
            if (user == null) {
                log.warn("⚠️ 未找到用户：{}", email);
                continue;
            }

            int moodCount = moodMapper.countTodayMoods(user.getId(), today);
            if (moodCount == 0) {
                MailMessageDTO mail = new MailMessageDTO();
                mail.setTo(email);
                mail.setSubject("🌙 晚间提醒：记录一下今天的心情吧！");

                String content = """
                        好宝好宝
                        
                        今天还没有记录心情呢～
                        
                        👉 <a href="http://usyd-catams.site/mood">花 1 分钟写记录一下呢 💭</a>
                        """;

                mail.setContent(content);
                mailQueueProducer.enqueueMailMessage(mail);
                log.info("📧 已发送心情提醒邮件 -> {}", email);
            } else {
                log.info("✅ 用户 {} 今天已记录心情，跳过提醒。", email);
            }
        }
    }
}
