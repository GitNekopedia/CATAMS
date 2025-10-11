package com.usyd.catams.application.service;

import com.usyd.catams.infrastructure.config.RabbitConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class TestProducer {

    private final RabbitTemplate rabbitTemplate;

    public TestProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendTestMessage(String msg) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.TEST_EXCHANGE,
                RabbitConfig.TEST_ROUTING_KEY,
                msg
        );
        System.out.println("✅ Sent message to MQ: " + msg);
    }
}
