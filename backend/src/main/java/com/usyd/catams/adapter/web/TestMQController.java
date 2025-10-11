package com.usyd.catams.adapter.web;

import com.usyd.catams.application.service.TestProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestMQController {

    private final TestProducer producer;

    public TestMQController(TestProducer producer) {
        this.producer = producer;
    }

    @GetMapping("/test/mq")
    public String sendMsg() {
        producer.sendTestMessage("Hello RabbitMQ 🐇 " + System.currentTimeMillis());
        return "Message sent!";
    }
}
