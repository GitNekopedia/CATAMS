package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TaskTypeDTO {
    private Long id;
    private Long unitId;
    private String name;
    private BigDecimal phdPayRate;
    private BigDecimal nonPhdPayRate;
    private String createdAt;
    private String updatedAt;
}
