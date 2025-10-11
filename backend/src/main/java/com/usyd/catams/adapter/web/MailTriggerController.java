package com.usyd.catams.adapter.web;

import com.usyd.catams.infrastructure.config.RabbitConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mail")
public class MailTriggerController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/process")
    public String processMails() {
        Object msg;
        int count = 0;
        while ((msg = rabbitTemplate.receiveAndConvert(RabbitConfig.MAIL_QUEUE)) != null) {
            System.out.println("📩 Sending batch mail: " + msg);
            count++;
        }
        return "Processed " + count + " messages.";
    }
}
