package com.usyd.catams.adapter.web.dto;

import lombok.Data;

@Data
public class TaskRequest {
    private Long unitId;  // 课程ID
    private Long typeId;  // 类型ID
    private String name;  // 任务名称
}
