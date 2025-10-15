package com.usyd.catams.domain.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user")
public class UserEntity {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String email;
    private String role; // Lecturer / Tutor / HR / Admin
    private LocalDateTime createdAt;
    private LocalDateTime  updatedAt;

    public String getPassword() {
        return name;
    }
}
