package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.persistence.UserMapper;
import com.usyd.catams.adapter.web.dto.LoginRequest;
import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.application.service.AuthTokenService;
import com.usyd.catams.domain.model.UserEntity;
import com.usyd.catams.infrastructure.exception.*;
import com.usyd.catams.infrastructure.security.AuthUserContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户认证与鉴权控制器
 * - /login 登录并签发 JWT
 * - /currentUser 获取当前登录用户
 * - /outLogin 登出（前端清除 token 即可）
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final UserMapper userMapper;
    private final AuthTokenService tokenService;

    /**
     * 登录接口
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {

        // 查找用户
        UserEntity user = userMapper.findByEmail(request.getEmail());
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            // ✅ 使用统一异常体系
            throw new BusinessException(BusinessCode.UNAUTHORIZED, "Invalid email or password");
        }

        // 构造返回数据
        LoginResponse.UserDTO userDTO = new LoginResponse.UserDTO(user.getId(), user.getName(), user.getRole());
        String token = tokenService.issueToken(userDTO);

        LoginResponse resp = new LoginResponse();
        resp.setToken(token);
        resp.setUser(userDTO);

        return ApiResponse.ok(resp);
    }

    /**
     * 获取当前登录用户
     */
    @GetMapping("/currentUser")
    public ApiResponse<LoginResponse.UserDTO> currentUser(HttpServletRequest request) {
        LoginResponse.UserDTO userDTO = AuthUserContext.get();
        return ApiResponse.ok(userDTO);
    }

    /**
     * 登出接口
     * 注意：JWT 一般无状态，所以这里只清理前端本地存储即可。
     */
    @PostMapping("/outLogin")
    public ApiResponse<String> outLogin(HttpServletRequest request) {
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        // 若后端实现了黑名单策略，可以在此失效 token
        return ApiResponse.ok("Logged out successfully");
    }
}
