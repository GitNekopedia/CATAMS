package com.usyd.catams.infrastructure.messaging;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.api.RabbitListenerErrorHandler;
import org.springframework.amqp.rabbit.support.ListenerExecutionFailedException;
import org.springframework.messaging.MessageHeaders;
import org.springframework.stereotype.Component;

/**
 * MQ 全局异常处理器（Spring Boot 3.x 适配版）
 */
@Component("mailErrorHandler")
public class MailErrorHandler implements RabbitListenerErrorHandler {

    @Override
    public Object handleError(Message amqpMessage,
                              Channel channel,
                              org.springframework.messaging.Message<?> springMessage,
                              ListenerExecutionFailedException ex) throws Exception {

        MessageHeaders headers = springMessage.getHeaders();
        System.err.printf("🐇 [MailErrorHandler] MQ Listener Exception:%n%s%nHeaders:%s%n",
                ex.getMessage(), headers);

        // ⚙️ 这里你可以选择：写入数据库、告警、或 NACK 消息
        // 例如：
        // channel.basicNack(amqpMessage.getMessageProperties().getDeliveryTag(), false, true);

        return null; // 返回 null 表示不改变默认处理逻辑
    }
}
