package com.usyd.catams.infrastructure.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "reminder")
@PropertySource(value = "classpath:config/reminder-accounts.yml", factory = YamlPropertySourceFactory.class)
public class ReminderAccountConfig {
    private List<String> accounts;
}
