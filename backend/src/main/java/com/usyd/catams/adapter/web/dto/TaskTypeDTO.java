package com.usyd.catams.adapter.web.dto;

import lombok.Data;

@Data
public class TaskTypeDTO {
    private Long id;
    private Long unitId;
    private String name;
    private String createdAt;
    private String updatedAt;
}
