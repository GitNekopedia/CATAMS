package com.usyd.catams.adapter.web.dto;

import lombok.Data;

@Data
public class TaskDTO {
    private Long id;
    private Long unitId;
    private Long typeId;
    private String name;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;
}
