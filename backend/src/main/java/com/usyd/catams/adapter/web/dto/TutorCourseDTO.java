package com.usyd.catams.adapter.web.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TutorCourseDTO {
    private Long id;             // unit_assignment.id
    private Long unitId;         // course_unit.id
    private String code;         // course_unit.code
    private String name;         // course_unit.name
    private BigDecimal payRate;  // unit_assignment.pay_rate
    private BigDecimal quotaHours; // unit_assignment.quota_hours
}
