package com.usyd.catams.application.query;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.usyd.catams.adapter.persistence.UserMapper;
import com.usyd.catams.domain.model.UserEntity;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserQueryService {
    private final UserMapper userMapper;
    public UserQueryService(UserMapper userMapper) { this.userMapper = userMapper; }

    @Cacheable(cacheNames = "users", key = "'all'")
    public List<UserEntity> listAll() {
        return userMapper.selectList(new LambdaQueryWrapper<>());
    }

    public Long create(String name, String email, String role) {
        UserEntity u = new UserEntity();
        u.setName(name);
        u.setEmail(email);
        u.setRole(role);
        userMapper.insert(u);
        return u.getId();
    }
}
