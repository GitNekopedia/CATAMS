package com.usyd.catams.application.query.impl;

import com.usyd.catams.adapter.persistence.UserMapper;
import com.usyd.catams.application.query.UserQueryService;
import com.usyd.catams.domain.model.UserEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserQueryServiceImpl implements UserQueryService {

    private final UserMapper mapper;

    public UserQueryServiceImpl(UserMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public List<UserEntity> listAll() {
        return mapper.selectAll();
    }

    @Override
    public List<UserEntity> list(String role, String keyword) {
        return mapper.selectByCondition(role, keyword);
    }

    @Override
    public Long create(String name, String email, String role) {
        UserEntity entity = new UserEntity();
        entity.setName(name);
        entity.setEmail(email);
        entity.setRole(role);
        mapper.insert(entity);
        return entity.getId();
    }

    @Override
    public void update(Long id, String name, String email, String role) {
        UserEntity entity = new UserEntity();
        entity.setId(id);
        entity.setName(name);
        entity.setEmail(email);
        entity.setRole(role);
        mapper.update(entity);
    }

    @Override
    public void delete(Long id) {
        mapper.delete(id);
    }
}
