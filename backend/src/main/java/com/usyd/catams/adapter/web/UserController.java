package com.usyd.catams.adapter.web;

import com.usyd.catams.adapter.web.dto.ApiResponse;
import com.usyd.catams.application.query.UserQueryService;
import com.usyd.catams.domain.model.UserEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserQueryService svc;

    public UserController(UserQueryService svc) {
        this.svc = svc;
    }

    /** 获取用户列表（支持按角色和关键字筛选） */
    @GetMapping("/list")
    public ApiResponse<List<UserEntity>> list(@RequestParam(required = false) String role,
                                              @RequestParam(required = false) String keyword) {
        List<UserEntity> users = svc.list(role, keyword);
        return ApiResponse.ok(users);
    }

    /** 创建新用户 */
    @PostMapping("/create")
    public ApiResponse<Map<String, Object>> create(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String role = body.get("role");

        try {
            Long id = svc.create(name, email, role);
            return ApiResponse.ok(Map.of("id", id));
        } catch (Exception e) {
            return ApiResponse.fail("Failed to create user: " + e.getMessage());
        }
    }

    /** 更新用户 */
    @PutMapping("/update/{id}")
    public ApiResponse<String> update(@PathVariable Long id,
                                      @RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String role = body.get("role");
        try {
            svc.update(id, name, email, role);
            return ApiResponse.ok("User updated successfully");
        } catch (Exception e) {
            return ApiResponse.fail("Failed to update user: " + e.getMessage());
        }
    }

    /** 删除用户 */
    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        try {
            svc.delete(id);
            return ApiResponse.ok("User deleted successfully");
        } catch (Exception e) {
            return ApiResponse.fail("Failed to delete user: " + e.getMessage());
        }
    }
}
