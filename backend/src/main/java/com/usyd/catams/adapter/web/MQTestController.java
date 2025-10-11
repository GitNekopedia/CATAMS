package com.usyd.catams.adapter.web;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MQTestController {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/test/rabbit")
    public String test() {
        rabbitTemplate.convertAndSend("mail.exchange", "mail.routingKey", "Hello MQ!");
        return "Sent!";
    }
}
