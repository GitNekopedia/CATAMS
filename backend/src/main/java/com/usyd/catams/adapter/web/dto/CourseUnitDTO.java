package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CourseUnitDTO {
    private Long id;
    private String code;
    private String name;
    private String semester;
    private BigDecimal totalBudgetHours;
    private BigDecimal remainingBudget;
}

