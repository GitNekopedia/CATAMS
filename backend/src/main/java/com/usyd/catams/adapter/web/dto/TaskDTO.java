package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TaskDTO {
    private Long id;
    private Long unitId;
    private Long typeId;
    private String name;
    private Boolean isActive;
    private BigDecimal phdPayRate;
    private BigDecimal nonPhdPayRate;
    private String createdAt;
    private String updatedAt;
}
