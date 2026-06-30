package com.usyd.catams.adapter.web;

import com.usyd.catams.application.query.UserQueryService;
import com.usyd.catams.domain.model.UserEntity;
import com.usyd.catams.infrastructure.exception.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 用户管理接口（已由 AuthInterceptor 校验 Token）
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserQueryService svc;

    /** 获取用户列表（支持按角色和关键字筛选） */
    @GetMapping("/list")
    public ApiResponse<List<UserEntity>> list(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String keyword
    ) {
        var users = svc.list(role, keyword);
        return ApiResponse.ok(users);
    }

    /** 创建新用户 */
    @PostMapping("/create")
    public ApiResponse<Map<String, Object>> create(@RequestBody Map<String, String> body) {
        var id = svc.create(body.get("name"), body.get("email"), body.get("role"));
        return ApiResponse.ok(Map.of("id", id));
    }

    /** 更新用户 */
    @PutMapping("/update/{id}")
    public ApiResponse<String> update(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        svc.update(id, body.get("name"), body.get("email"), body.get("role"));
        return ApiResponse.ok("User updated successfully");
    }

    /** 删除用户 */
    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        svc.delete(id);
        return ApiResponse.ok("User deleted successfully");
    }
}
