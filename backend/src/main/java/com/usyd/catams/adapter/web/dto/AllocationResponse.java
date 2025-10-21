package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AllocationResponse {
    private Long id;
    private Long unitId;
    private Long tutorId;
    private Long taskId;
    private String taskName;
    private String typeName;
    private String payCategory;
    private BigDecimal payRate;
    private String weekStart;  // yyyy-MM-dd
    private Double plannedHours;
}