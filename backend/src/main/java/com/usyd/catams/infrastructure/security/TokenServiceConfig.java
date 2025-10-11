package com.usyd.catams.infrastructure.security;

import com.usyd.catams.application.service.AuthTokenService;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * 方式三：由配置类在启动时“手动挑选并只注册一个” AuthTokenService 实现。
 * 优先 Redis，不可用则回退到内存。
 */
@Configuration
public class TokenServiceConfig {

    @Bean
    public AuthTokenService authTokenService(
            Environment env,
            // RedisTemplate 可选注入，项目没启 Redis 时为 null（或注入失败）
            ObjectProvider<RedisTemplate<String, Object>> redisTemplateProvider
    ) {
        // 开关：是否优先 Redis（默认 true）；以及是否做启动 ping 检查（默认 true）
        boolean preferRedis = env.getProperty("catams.auth.token.prefer", Boolean.class, true);
        boolean startupCheck = env.getProperty("catams.auth.token.startup-check", Boolean.class, true);

        RedisTemplate<String, Object> redisTemplate = redisTemplateProvider.getIfAvailable();

        if (preferRedis && redisTemplate != null) {
            // 启动健康检查（可关）
            if (!startupCheck || pingRedis(redisTemplate)) {
                System.out.printf("✅ Using RedisTokenService (preferRedis=%s, startupCheck=%s)%n",
                        preferRedis, startupCheck);
                return new RedisTokenService(redisTemplate); // 直接 new
            } else {
                System.err.println("⚠️ Redis ping failed, fallback to InMemoryTokenService");
            }
        } else {
            System.out.printf("ℹ️ PreferRedis=%s, redisTemplate=%s → skip redis%n",
                    preferRedis, (redisTemplate != null));
        }

        System.out.println("✅ Using InMemoryTokenService (fallback)");
        return new InMemoryTokenService(); // 直接 new，与你现有实现一致
    }

    private boolean pingRedis(RedisTemplate<String, Object> tpl) {
        try (RedisConnection conn = tpl.getRequiredConnectionFactory().getConnection()) {
            String pong = conn.ping();
            return pong != null && pong.equalsIgnoreCase("PONG");
        } catch (Exception e) {
            System.err.printf("💥 Redis ping error: %s%n", e.getMessage());
            return false;
        }
    }
}
