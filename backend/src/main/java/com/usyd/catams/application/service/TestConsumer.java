package com.usyd.catams.application.service;

import com.usyd.catams.infrastructure.config.RabbitConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class TestConsumer {

    @RabbitListener(queues = RabbitConfig.TEST_QUEUE)
    public void receiveMessage(String msg) {
        System.out.println("📩 Received from MQ: " + msg);
    }
}
