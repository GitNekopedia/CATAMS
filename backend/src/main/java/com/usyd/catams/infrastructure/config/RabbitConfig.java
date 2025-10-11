package com.usyd.catams.infrastructure.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class RabbitConfig {

    public static final String TEST_EXCHANGE = "test.exchange";
    public static final String TEST_QUEUE = "test.queue";
    public static final String TEST_ROUTING_KEY = "test.key";

    // 1️⃣ 声明 Exchange（交换机）
    @Bean
    public DirectExchange testExchange() {
        return new DirectExchange(TEST_EXCHANGE, true, false);
    }

    // 2️⃣ 声明 Queue（队列）
    @Bean
    public Queue testQueue() {
        return new Queue(TEST_QUEUE, true);
    }

    // 3️⃣ 绑定关系
    @Bean
    public Binding binding() {
        return BindingBuilder.bind(testQueue())
                .to(testExchange())
                .with(TEST_ROUTING_KEY);
    }

    public static final String MAIL_EXCHANGE = "mail.exchange";
    public static final String MAIL_QUEUE = "mail.queue";
    public static final String MAIL_ROUTING_KEY = "mail.routingKey";
    public static final String MAIL_DLX_EXCHANGE = "mail.dlx.exchange";
    public static final String MAIL_RETRY_QUEUE = "mail.retry.queue";
    public static final String MAIL_RETRY_ROUTING_KEY = "mail.retry.key";

    // === 1️⃣ 正常 Exchange ===
    @Bean
    public DirectExchange mailExchange() {
        return new DirectExchange(MAIL_EXCHANGE, true, false);
    }

    // === 2️⃣ 死信 Exchange ===
    @Bean
    public DirectExchange mailDLXExchange() {
        return new DirectExchange(MAIL_DLX_EXCHANGE, true, false);
    }

    // === 3️⃣ 正常 Queue（带死信参数）===
    @Bean
    public Queue mailQueue() {
        return QueueBuilder.durable(MAIL_QUEUE)
                .withArgument("x-dead-letter-exchange", MAIL_DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", MAIL_RETRY_ROUTING_KEY)
                .build();
    }

    // === 4️⃣ 重试队列（延迟 60s 后重投）===
    @Bean
    public Queue mailRetryQueue() {
        return QueueBuilder.durable(MAIL_RETRY_QUEUE)
                .withArgument("x-message-ttl", 60000) // 60 秒延迟
                .withArgument("x-dead-letter-exchange", MAIL_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", MAIL_ROUTING_KEY)
                .build();
    }

    // === 5️⃣ 绑定关系 ===
    @Bean
    public Binding mailBinding() {
        return BindingBuilder.bind(mailQueue())
                .to(mailExchange())
                .with(MAIL_ROUTING_KEY);
    }

    @Bean
    public Binding mailRetryBinding() {
        return BindingBuilder.bind(mailRetryQueue())
                .to(mailDLXExchange())
                .with(MAIL_RETRY_ROUTING_KEY);
    }

    // === 6️⃣ JSON 转换器 ===
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // === 7️⃣ 开启手动 ACK 模式 ===
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter converter) {

        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(converter);
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL); // 手动确认
        factory.setPrefetchCount(5); // 控制并发消费
        return factory;
    }
}