package com.usyd.catams.infrastructure.messaging;

import com.rabbitmq.client.Channel;
import com.usyd.catams.application.service.MailService;
import com.usyd.catams.infrastructure.config.RabbitConfig;
import com.usyd.catams.infrastructure.messaging.dto.MailMessageDTO;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * 邮件消息消费者：接收来自 MQ 的任务并发送邮件。
 * 支持异常区分、手动确认、自动重试。
 */
@Component
public class MailQueueConsumer {

    private final MailService mailService;
    private static final int MAX_RETRY_COUNT = 3; // 最大重试次数

    public MailQueueConsumer(MailService mailService) {
        this.mailService = mailService;
    }

    /**
     * 消费来自 RabbitMQ 的邮件任务并通过 SMTP 发送邮件。
     * - 手动 ACK 模式（成功后确认）
     * - 捕获业务与系统异常
     * - 系统异常自动重试
     */
    @RabbitListener(queues = RabbitConfig.MAIL_QUEUE,
            concurrency = "3-6",
            containerFactory = "rabbitListenerContainerFactory",
            errorHandler = "mailErrorHandler")
    public void handleMailMessage(MailMessageDTO mail, Channel channel, Message message) throws Exception {
        long tag = message.getMessageProperties().getDeliveryTag();
        System.out.printf("📬 [Consumer] Received MQ mail task → To: %s | Subject: %s%n",
                mail.getTo(), mail.getSubject());

        // 获取消息头
        Map<String, Object> headers = message.getMessageProperties().getHeaders();
        int retryCount = getRetryCount(headers);

        try {
            // 尝试发送邮件
            mailService.sendMail(mail.getTo(), mail.getSubject(), mail.getContent());
            System.out.printf("✅ [Consumer] Mail sent successfully → %s%n", mail.getTo());

            // 手动确认（成功后 ACK）
            channel.basicAck(tag, false);

        } catch (IllegalArgumentException e) {
            // 不可恢复的业务异常（如参数无效）
            System.err.printf("⚠️ [Consumer] Invalid mail message, drop → To: %s | Reason: %s%n",
                    mail.getTo(), e.getMessage());
            channel.basicAck(tag, false);

        } catch (Exception e) {
            // 可重试的系统异常
            if (retryCount >= MAX_RETRY_COUNT) {
                // 超过最大次数后丢弃
                System.err.printf("🚫 [Consumer] Retry limit reached (%d), drop message → %s%n",
                        retryCount, mail.getTo());
                channel.basicAck(tag, false);
            } else {
                System.err.printf("❌ [Consumer] Send failed, will retry (attempt %d/%d) → %s | Error: %s%n",
                        retryCount + 1, MAX_RETRY_COUNT, mail.getTo(), e.getMessage());
                // Reject without requeue so RabbitMQ routes it through the configured retry queue.
                channel.basicReject(tag, false);
            }
        }
    }

    /**
     * 从 x-death 头中解析当前重试次数
     */
    private int getRetryCount(Map<String, Object> headers) {
        if (headers == null || !headers.containsKey("x-death")) return 0;
        try {
            List<Map<String, Object>> xDeath = (List<Map<String, Object>>) headers.get("x-death");
            if (xDeath == null || xDeath.isEmpty()) return 0;
            Map<String, Object> lastDeath = xDeath.get(0);
            Long count = (Long) lastDeath.get("count");
            return count == null ? 0 : count.intValue();
        } catch (Exception e) {
            return 0;
        }
    }
}
