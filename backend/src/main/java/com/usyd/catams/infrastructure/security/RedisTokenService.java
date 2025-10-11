package com.usyd.catams.infrastructure.security;

import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.redis.core.RedisTemplate;


import java.time.Duration;
import java.util.UUID;

/**
 * 基于 Redis 的 Token 管理服务
 * - 自动过期（TTL）
 * - 支持多节点共享
 * - 防止内存泄漏
 */
public class RedisTokenService implements AuthTokenService {

    private static final String TOKEN_PREFIX = "auth:token:";  // Redis key 前缀
    private static final Duration TOKEN_TTL = Duration.ofMinutes(30); // token 有效期30min

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisTokenService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        System.out.println("✅ Serializer = " + redisTemplate.getValueSerializer().getClass().getName());

    }

    /**
     * 登录成功后生成一个新的 token，并将用户信息写入 Redis
     */
    @Override
    public String issueToken(LoginResponse.UserDTO user) {
        String token = UUID.randomUUID().toString();
        String key = TOKEN_PREFIX + token;
        // Redis 自动过期，无需手动清理
        redisTemplate.opsForValue().set(key, user, TOKEN_TTL);
        return token;
    }

    /**
     * 校验 token 是否存在与有效，返回对应用户信息
     */
    @Override
    public LoginResponse.UserDTO validateAndGetUser(String token) {
        if (token == null || token.isEmpty()) return null;
        Object obj = redisTemplate.opsForValue().get(TOKEN_PREFIX + token);
        System.out.println("类型 = " + (obj == null ? "null" : obj.getClass().getName()));
        System.out.println("值 = " + obj);
        if (obj instanceof LoginResponse.UserDTO user) {
            return user;
        }
        return null; // 不存在或过期自动返回 null
    }

    /**
     * 撤销指定 token（登出）
     */
    @Override
    public void revoke(String token) {
        if (token != null && !token.isEmpty()) {
            redisTemplate.delete(TOKEN_PREFIX + token);
        }
    }

    /**
     * 从请求头中提取 token 并验证
     */
    @Override
    public LoginResponse.UserDTO extractUserFromRequest(HttpServletRequest request) {
        String authz = request.getHeader("Authorization");
        String token = (authz != null && authz.toLowerCase().startsWith("bearer "))
                ? authz.substring(7).trim()
                : null;
        return validateAndGetUser(token);
    }
}
