package com.usyd.catams.infrastructure.security;

import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.application.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Primary // 多实现时优先使用这个
public class InMemoryTokenService implements AuthTokenService {

    /**
     * 内部类，保存用户信息和令牌过期时间
     */
    private static class TokenRecord {
        LoginResponse.UserDTO user;
        long expireAt; // 过期时间，单位为epoch秒

        TokenRecord(LoginResponse.UserDTO user, long expireAt) {
            this.user = user;
            this.expireAt = expireAt;
        }
    }

    // 线程安全的令牌存储，key为token字符串，value为TokenRecord对象
    private final ConcurrentHashMap<String, TokenRecord> store = new ConcurrentHashMap<>();

    /**
     * 生成一个新的token，并将用户信息和过期时间存入内存中
     * 过期时间为当前时间起7天后
     * @param user 登录用户信息
     * @return 生成的token字符串
     */
    @Override
    public String issueToken(LoginResponse.UserDTO user) {
        String token = UUID.randomUUID().toString();
        long expireAt = Instant.now().plusSeconds(7 * 24 * 3600).getEpochSecond();
        store.put(token, new TokenRecord(user, expireAt));
        return token;
    }

    /**
     * 验证token有效性并返回对应的用户信息
     * 如果token为空、未找到或已过期，返回null
     * @param token 令牌字符串
     * @return 关联的用户信息，或null表示无效
     */
    @Override
    public LoginResponse.UserDTO validateAndGetUser(String token) {
        if (token == null || token.isEmpty()) return null;
        TokenRecord r = store.get(token);
        if (r == null) return null;
        if (Instant.now().getEpochSecond() > r.expireAt) {
            store.remove(token);
            return null;
        }
        return r.user;
    }

    /**
     * 撤销指定的token，移除内存中的记录
     * @param token 令牌字符串
     */
    @Override
    public void revoke(String token) {
        if (token != null) store.remove(token);
    }

    @Override
    public LoginResponse.UserDTO extractUserFromRequest(HttpServletRequest request) {
        String authz = request.getHeader("Authorization");
        String token = (authz != null && authz.toLowerCase().startsWith("bearer "))
                ? authz.substring(7).trim() : null;
        return validateAndGetUser(token);
    }
}

