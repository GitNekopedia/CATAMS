package com.usyd.catams.adapter.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class LecturerCourseDTO {
        private Long id;             // unit_assignment.id
        private Long unitId;         // course_unit.id
        private String code;         // course_unit.code
        private String name;         // course_unit.name
        private BigDecimal totalBudgetHours; // unit_assignment.total_budget_hours
        private BigDecimal remainingBudget;
}
