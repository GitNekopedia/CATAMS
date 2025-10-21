package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CourseUnitDTO {
    private Long id;
    private String code;
    private String name;
    private String semester;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalBudgetHours;
    private BigDecimal remainingBudget;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}

