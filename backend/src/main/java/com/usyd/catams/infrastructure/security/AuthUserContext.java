package com.usyd.catams.infrastructure.security;

import com.usyd.catams.adapter.web.dto.LoginResponse;

/**
 * 当前登录用户上下文（基于 ThreadLocal 存储 UserDTO）
 * 可在任何位置通过 AuthUserContext.get() 获取当前用户
 */
public class AuthUserContext {

    private static final ThreadLocal<LoginResponse.UserDTO> CURRENT = new ThreadLocal<>();

    public static void set(LoginResponse.UserDTO user) {
        CURRENT.set(user);
    }

    public static LoginResponse.UserDTO get() {
        return CURRENT.get();
    }

    public static void clear() {
        CURRENT.remove();
    }
}
