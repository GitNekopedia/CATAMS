package com.usyd.catams.infrastructure.messaging;

import com.usyd.catams.infrastructure.config.RabbitConfig;
import com.usyd.catams.infrastructure.messaging.dto.MailMessageDTO;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class MailQueueProducer {

    private final RabbitTemplate rabbitTemplate;

    public MailQueueProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void enqueueMailMessage(MailMessageDTO mail) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.MAIL_EXCHANGE,
                RabbitConfig.MAIL_ROUTING_KEY,
                mail
        );
        System.out.println("✅ [MQ] Queued mail message: " + mail);
    }
}
