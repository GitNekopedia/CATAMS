package com.usyd.catams.adapter.web;

import com.usyd.catams.application.query.UserQueryService;
import com.usyd.catams.domain.model.UserEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserQueryService svc;
    public UserController(UserQueryService svc) { this.svc = svc; }

    @GetMapping
    public List<UserEntity> list() { return svc.listAll(); }

    @PostMapping
    public Map<String, Object> create(@RequestParam String name,
                                      @RequestParam String email,
                                      @RequestParam String role) {
        Long id = svc.create(name, email, role);
        return Map.of("id", id);
    }
}
