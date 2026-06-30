package com.usyd.catams.infrastructure.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.util.TimeZone;

@Configuration
public class TimeZoneConfig {
    @PostConstruct
    public void init() {
        // ✅ 让 JVM 默认使用 UTC
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.out.println("✅ Default JVM timezone set to UTC");
    }
}