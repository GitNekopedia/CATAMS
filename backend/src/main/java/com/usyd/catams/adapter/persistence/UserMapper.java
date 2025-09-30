package com.usyd.catams.adapter.persistence;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.domain.model.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {

    @Select("SELECT name FROM user WHERE id = #{id}")
    String findNameById(Long id);


    @Select("SELECT * FROM user WHERE email = #{email}")
    UserEntity findByEmail(String email);
}
