package com.usyd.catams.application.scheduler;

import com.usyd.catams.application.service.MoodReminderService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class MoodReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(MoodReminderScheduler.class);
    private final MoodReminderService reminderService;

    /** 每天北京时间 21:00 执行 */
    @Scheduled(cron = "0 0 21 * * ?", zone = "Asia/Shanghai")
    // @Scheduled(cron = "*/10 * * * * ?", zone = "Asia/Shanghai")
    public void sendDailyReminders() {
        log.info("⏰ 北京时间 21:00 执行，当前 UTC 时间：{}", Instant.now());
        reminderService.checkAndSendReminders();
    }
}
