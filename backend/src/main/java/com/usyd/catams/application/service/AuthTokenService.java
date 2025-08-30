package com.usyd.catams.application.service;

import com.usyd.catams.adapter.web.dto.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public interface AuthTokenService {
    String issueToken(LoginResponse.UserDTO user);                // 生成 token
    LoginResponse.UserDTO validateAndGetUser(String token);       // 验证并取用户
    void revoke(String token);                                    // 吊销/登出
    LoginResponse.UserDTO extractUserFromRequest(HttpServletRequest request); // 从请求中提取用户
}
