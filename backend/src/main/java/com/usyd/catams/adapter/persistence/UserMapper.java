package com.usyd.catams.adapter.persistence;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.usyd.catams.domain.model.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {

    @Select("SELECT name FROM user WHERE id = #{id}")
    String findNameById(Long id);


    @Select("SELECT * FROM user WHERE email = #{email}")
    UserEntity findByEmail(String email);

    @Select({
            "<script>",
            "SELECT email FROM user WHERE id IN ",
            "<foreach collection='ids' item='id' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    List<String> findEmailsByIds(@Param("ids") List<Long> ids);
    @Select("SELECT email FROM user WHERE id = #{id}")
    String findEmailById(Long id);

}
