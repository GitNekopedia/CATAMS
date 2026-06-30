package com.usyd.catams.infrastructure.security;

import com.usyd.catams.application.service.AuthTokenService;
import com.usyd.catams.infrastructure.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 鉴权拦截器：统一从请求头解析 JWT 并存入 AuthUserContext
 */
@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final AuthTokenService authTokenService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        // 解析 token -> UserDTO
        var user = authTokenService.extractUserFromRequest(request);
        if (user == null) {
            throw new UnauthorizedException("Missing or invalid JWT token");
        }

        AuthUserContext.set(user);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        AuthUserContext.clear(); // 防止内存泄漏
    }
}
