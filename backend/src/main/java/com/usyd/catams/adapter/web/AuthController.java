package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.persistence.UserMapper;
import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.adapter.web.dto.LoginRequest;
import com.usyd.catams.adapter.web.dto.LoginResponse;
import com.usyd.catams.application.service.AuthTokenService;
import com.usyd.catams.domain.model.UserEntity;
import jakarta.servlet.http.HttpServletRequest;


import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserMapper userMapper;
    private final AuthTokenService tokenService;

    public AuthController(AuthTokenService tokenService, UserMapper userMapper) {
        this.tokenService = tokenService;
        this.userMapper = userMapper;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        UserEntity user = userMapper.findByEmail(request.getEmail());
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return ApiResponse.fail("Invalid email or password");
        }

        LoginResponse.UserDTO userDTO = new LoginResponse.UserDTO(user.getId(), user.getName(), user.getRole());
        String token = tokenService.issueToken(userDTO);

        LoginResponse resp = new LoginResponse();
        resp.setToken(token);
        resp.setUser(userDTO);

        return ApiResponse.ok(resp);
    }

    @GetMapping("/currentUser")
    public ApiResponse<LoginResponse.UserDTO> currentUser(HttpServletRequest request) {
        // 从请求中提取用户
        LoginResponse.UserDTO user = tokenService.extractUserFromRequest(request);
        // 如果token无效或用户不存在，返回失败响应，状态为未授权
        if (user == null) return ApiResponse.fail("Unauthorized");
        // 返回成功响应，包含当前用户信息
        return ApiResponse.ok(user);
    }

    @PostMapping("/outLogin")
    public ApiResponse<String> outLogin(HttpServletRequest request) {
        // 从请求中提取用户
        var user = tokenService.extractUserFromRequest(request);
        if (user == null) {
            return ApiResponse.fail("Unauthorized");
        }

        // 前端会清掉本地 token，所以这里只需要返回成功
        return ApiResponse.ok("Logged out successfully");

    }
}
