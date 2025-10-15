package com.usyd.catams.application.query;

import com.usyd.catams.domain.model.UserEntity;
import java.util.List;

public interface UserQueryService {
    List<UserEntity> listAll();
    List<UserEntity> list(String role, String keyword);
    Long create(String name, String email, String role);
    void update(Long id, String name, String email, String role);
    void delete(Long id);
}
