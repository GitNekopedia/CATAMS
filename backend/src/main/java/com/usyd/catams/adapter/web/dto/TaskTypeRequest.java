package com.usyd.catams.adapter.web.dto;

import lombok.Data;

@Data
public class TaskTypeRequest {
    private Long unitId;   // 课程ID
    private String name;   // 类型名，例如 "Tutorial"
}
